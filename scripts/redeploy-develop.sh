#!/usr/bin/env bash

set -Eeuo pipefail

########################################
# Config (override via env vars if needed)
########################################
SERVICE_NAME="${SERVICE_NAME:-tamahana}"
APP_USER="${APP_USER:-tamahana}"
APP_GROUP="${APP_GROUP:-tamahana}"
APP_BASE_DIR="${APP_BASE_DIR:-/var/www/tamahana}"
APP_DIR="${APP_DIR:-${APP_BASE_DIR}/app}"
ENV_FILE="${ENV_FILE:-${APP_BASE_DIR}/.env.production}"
REPO_URL="${REPO_URL:-https://github.com/Antoaane/Tamahana.git}"
BRANCH="${BRANCH:-develop}"
APP_PORT="${APP_PORT:-43127}"
ENABLE_CERTBOT="${ENABLE_CERTBOT:-false}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-antoinelauzis@gmail.com}"
DOMAIN="${DOMAIN:-tamahana.fr}"
DOMAIN_WWW="${DOMAIN_WWW:-www.${DOMAIN}}"
ENABLE_DB_RESET="${ENABLE_DB_RESET:-false}"
DB_NAME="${DB_NAME:-tamahana_db}"
DB_OWNER="${DB_OWNER:-tamahana}"
DB_OWNER_PASSWORD="${DB_OWNER_PASSWORD:-}"

########################################
# Helpers
########################################
log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

die() {
  log "ERROR: $*"
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Commande manquante: $1"
}

get_env_value() {
  local key="$1"
  local file="$2"
  local line

  line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
  line="${line#*=}"

  # Trim optional wrapping quotes from .env format
  if [[ "${line}" == \"*\" && "${line}" == *\" ]]; then
    line="${line#\"}"
    line="${line%\"}"
  elif [[ "${line}" == \'*\' && "${line}" == *\' ]]; then
    line="${line#\'}"
    line="${line%\'}"
  fi

  printf '%s' "${line}"
}

########################################
# Preconditions
########################################
[ "$(id -u)" -eq 0 ] || die "Lance ce script en root (sudo)."
[ -n "${REPO_URL}" ] || die "REPO_URL est vide. Exemple: REPO_URL='https://github.com/org/repo.git' ./scripts/redeploy-develop.sh"
[[ "${APP_PORT}" =~ ^[0-9]+$ ]] || die "APP_PORT doit être numérique"
(( APP_PORT >= 1024 && APP_PORT <= 65535 )) || die "APP_PORT doit être entre 1024 et 65535"

require_cmd git
require_cmd node
require_cmd npm
require_cmd systemctl

########################################
# Ensure runtime user + folders
########################################
if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  log "Création utilisateur système ${APP_USER}"
  adduser --system --group --home "${APP_BASE_DIR}" "${APP_USER}"
fi

mkdir -p "${APP_BASE_DIR}"
chown -R "${APP_USER}:${APP_GROUP}" "${APP_BASE_DIR}"

# Keep secrets outside app folder so full app recreation is safe.
if [ -f "${APP_DIR}/.env" ] && [ ! -f "${ENV_FILE}" ]; then
  log "Migration ${APP_DIR}/.env -> ${ENV_FILE}"
  cp "${APP_DIR}/.env" "${ENV_FILE}"
  chown "${APP_USER}:${APP_GROUP}" "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"
fi

[ -f "${ENV_FILE}" ] || die "Fichier d'env introuvable: ${ENV_FILE}"

########################################
# Stop current app instance
########################################
if systemctl list-unit-files | grep -q "^${SERVICE_NAME}\.service"; then
  log "Arrêt service ${SERVICE_NAME}"
  systemctl stop "${SERVICE_NAME}" || true
fi

if command -v fuser >/dev/null 2>&1; then
  log "Nettoyage listener sur le port ${APP_PORT} (si présent)"
  fuser -k "${APP_PORT}/tcp" >/dev/null 2>&1 || true
fi

########################################
# Optional DB reset (DESTRUCTIVE)
########################################
if [ "${ENABLE_DB_RESET}" = "true" ]; then
  require_cmd psql

  DB_NAME_RESOLVED="${DB_NAME}"
  DB_OWNER_RESOLVED="${DB_OWNER}"

  if [ -z "${DB_NAME_RESOLVED}" ] || [ -z "${DB_OWNER_RESOLVED}" ]; then
    DATABASE_URL_VALUE="$(get_env_value "DATABASE_URL" "${ENV_FILE}")"
    [ -n "${DATABASE_URL_VALUE}" ] || die "DATABASE_URL introuvable dans ${ENV_FILE} (requis pour ENABLE_DB_RESET=true)"

    # Resolve owner + db name from DATABASE_URL when not explicitly provided.
    read -r URL_OWNER URL_DB_NAME < <(
      node -e "const u=new URL(process.argv[1]); const db=u.pathname.replace(/^\\/+/, ''); process.stdout.write((decodeURIComponent(u.username||'')+' '+decodeURIComponent(db||'')));" "${DATABASE_URL_VALUE}"
    )

    [ -n "${DB_NAME_RESOLVED}" ] || DB_NAME_RESOLVED="${URL_DB_NAME}"
    [ -n "${DB_OWNER_RESOLVED}" ] || DB_OWNER_RESOLVED="${URL_OWNER}"
  fi

  [ -n "${DB_NAME_RESOLVED}" ] || die "DB_NAME introuvable. Passe DB_NAME=... ou DATABASE_URL dans ${ENV_FILE}"
  [ -n "${DB_OWNER_RESOLVED}" ] || die "DB_OWNER introuvable. Passe DB_OWNER=... ou user dans DATABASE_URL"

  log "RESET DB ACTIVÉ: drop + recreate de '${DB_NAME_RESOLVED}' (owner '${DB_OWNER_RESOLVED}')"

  ROLE_EXISTS="$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_OWNER_RESOLVED//\'/\'\'}'" | tr -d '[:space:]' || true)"
  if [ "${ROLE_EXISTS}" != "1" ]; then
    if [ -n "${DB_OWNER_PASSWORD}" ]; then
      log "Role PostgreSQL '${DB_OWNER_RESOLVED}' absent, création avec DB_OWNER_PASSWORD"
      sudo -u postgres psql -v ON_ERROR_STOP=1 -v db_owner="${DB_OWNER_RESOLVED}" -v db_owner_password="${DB_OWNER_PASSWORD}" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_owner', :'db_owner_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_owner') \gexec
SQL
    else
      die "Role PostgreSQL '${DB_OWNER_RESOLVED}' absent. Fournis DB_OWNER_PASSWORD=... pour le créer."
    fi
  fi

  sudo -u postgres psql -v ON_ERROR_STOP=1 -v db_name="${DB_NAME_RESOLVED}" -v db_owner="${DB_OWNER_RESOLVED}" <<'SQL'
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = :'db_name'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS :"db_name";
CREATE DATABASE :"db_name" OWNER :"db_owner";
SQL
fi

########################################
# Recreate app instance from develop
########################################
log "Suppression instance applicative: ${APP_DIR}"
rm -rf "${APP_DIR}"

log "Clone ${REPO_URL} (branche ${BRANCH})"
sudo -u "${APP_USER}" -H git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${APP_DIR}"

log "Installation dépendances + build + migrations"
sudo -u "${APP_USER}" -H bash -lc "cd '${APP_DIR}' && npm ci && npm run build && npm run payload -- migrate"

########################################
# (Re)create systemd unit each run
########################################
log "Recréation unit systemd ${SERVICE_NAME}.service"
cat >/etc/systemd/system/"${SERVICE_NAME}".service <<EOF
[Unit]
Description=Tamahana Next.js + Payload
After=network.target postgresql.service

[Service]
Type=simple
User=${APP_USER}
Group=${APP_GROUP}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${ENV_FILE}
Environment=PORT=${APP_PORT}
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now "${SERVICE_NAME}"

########################################
# Final checks
########################################
if systemctl is-active --quiet "${SERVICE_NAME}"; then
  log "OK: service ${SERVICE_NAME} actif."
else
  log "Le service ${SERVICE_NAME} n'est pas actif."
  systemctl status "${SERVICE_NAME}" --no-pager || true
  exit 1
fi

if command -v ss >/dev/null 2>&1; then
  log "Ecoute port ${APP_PORT}:"
  ss -lptn "sport = :${APP_PORT}" || true
fi

########################################
# Optional TLS step (no-op by default)
########################################
if [ "${ENABLE_CERTBOT}" = "true" ]; then
  require_cmd certbot
  [ -n "${CERTBOT_EMAIL}" ] || die "CERTBOT_EMAIL requis si ENABLE_CERTBOT=true"
  [ -n "${DOMAIN}" ] || die "DOMAIN requis si ENABLE_CERTBOT=true"

  log "Certbot: vérification/émission du certificat pour ${DOMAIN} ${DOMAIN_WWW}"
  certbot --apache \
    --non-interactive \
    --agree-tos \
    --email "${CERTBOT_EMAIL}" \
    -d "${DOMAIN}" \
    -d "${DOMAIN_WWW}" \
    --redirect
fi

log "Redeploy terminé."
