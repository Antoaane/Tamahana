---
name: tailwindcss
description: Utiliser Tailwind CSS v4.1 proprement dans ce repo, créer ou modifier des interfaces sans casser le design system, en privilégiant les utilitaires natifs, les tokens de thème CSS, l’accessibilité et la lisibilité.
---

# Tailwind CSS v4.1

## Quand utiliser ce skill
Utilise ce skill quand la demande concerne Tailwind CSS, notamment pour :
- créer ou modifier des composants UI
- convertir du CSS custom vers Tailwind
- corriger des classes Tailwind
- améliorer responsive, états, dark mode, accessibilité
- ajouter des tokens de design
- factoriser du style répétitif
- vérifier qu’une implémentation suit bien Tailwind v4.x

## Objectif
Produire du code UI maintenable, idiomatique Tailwind v4.1, cohérent avec le repo, avec un minimum de CSS custom et sans sur-ingénierie.

## Règles principales

### 1) Toujours raisonner en Tailwind v4.1
- Utiliser la syntaxe et les pratiques de Tailwind v4.x, pas les anciennes conventions v3 si elles ne sont plus adaptées.
- Préférer `@import "tailwindcss";` dans le CSS principal.
- Ne pas partir du principe qu’un `tailwind.config.js` est la source principale de customisation.
- Si le projet utilise encore une config JS legacy, la respecter, mais ne pas l’étendre inutilement si une solution CSS native v4 est préférable.

### 2) Respecter l’existant
Avant de modifier :
- identifier la stack du projet : React, Next.js, Vue, Svelte, Laravel, etc.
- repérer le point d’entrée CSS principal
- repérer les conventions de classes déjà en place
- repérer si le projet utilise un design system, des composants partagés, `clsx`, `cva`, `tailwind-merge`, ou une convention maison

### 3) Priorité aux utilitaires natifs
- Préférer les classes utilitaires Tailwind aux blocs CSS custom.
- N’écrire du CSS custom que si :
  - le style est trop complexe ou trop répétitif
  - il faut définir des tokens de thème
  - il faut créer une utility ou variant réutilisable
- Ne pas recréer en CSS ce que Tailwind fournit déjà.

### 4) Utiliser correctement les capacités de v4
Quand pertinent :
- utiliser `@theme` pour les tokens de design
- utiliser `@utility` pour des utilitaires métier réutilisables
- utiliser `@variant` pour des variantes personnalisées
- utiliser `@source` si des fichiers doivent être explicitement scannés
- utiliser des valeurs arbitraires `[...]` seulement quand elles sont justifiées

### 5) Accessibilité obligatoire
Toujours vérifier :
- contraste suffisant
- états `hover`, `focus`, `focus-visible`, `disabled`
- tailles de cible cliquable correctes
- structure sémantique HTML correcte
- pas de dépendance à la couleur seule pour transmettre une info
- pour les formulaires : labels, messages d’erreur, `aria-*` si nécessaire

### 6) Responsive propre
- Construire mobile-first
- Préférer une hiérarchie simple des breakpoints
- Éviter les empilements de classes responsive inutiles
- Garder une structure lisible

### 7) Unités viewport (`vh`, `dvh`, `svh`, `lvh`)
- Par défaut pour les sections plein écran sur mobile moderne : préférer `dvh` (`h-dvh`, `min-h-dvh`) pour suivre la hauteur visible réelle quand les barres navigateur apparaissent/disparaissent.
- Utiliser `svh` (`h-svh`, `min-h-svh`) quand il faut garantir qu’aucun contenu ne soit masqué, même avec UI navigateur présente.
- Utiliser `lvh` (`h-lvh`, `min-h-lvh`) seulement si tu veux explicitement la plus grande hauteur possible (cas visuels spécifiques).
- Éviter `100vh` comme choix par défaut mobile : il peut causer du contenu coupé ou des sauts de layout.
- Pour robustifier un layout : combiner fallback + unité moderne, par exemple `min-h-screen min-h-dvh`.
- Privilégier les utilitaires Tailwind natifs (`h-dvh`, `min-h-dvh`, `max-h-dvh`) avant toute valeur arbitraire.

### 8) Classes lisibles
- Garder les classes groupées de façon logique : layout, spacing, typography, color, effects, state
- Si le repo utilise le tri automatique Tailwind via Prettier, respecter ce format
- Si une ligne devient illisible, factoriser via composant, helper, ou utility dédiée

### 9) Pas de bricolage
- Ne pas ajouter de dépendance UI si la demande porte juste sur du styling
- Ne pas introduire du CSS inline sans raison
- Ne pas multiplier les `!important`
- Ne pas casser l’API d’un composant existant sans nécessité explicite
- Ne pas inventer des classes dynamiques introuvables par le scanner Tailwind

## Procédure de travail

### Pour une création ou modification de composant
1. Lire le composant existant et son contexte
2. Identifier les patterns UI déjà présents dans le repo
3. Proposer une implémentation Tailwind v4 idiomatique
4. Réduire le CSS custom au strict minimum
5. Vérifier responsive + accessibilité + états interactifs
6. Si les classes deviennent trop longues, factoriser proprement

### Pour une migration CSS vers Tailwind
1. Conserver le rendu fonctionnel
2. Mapper d’abord layout, spacing, typo, couleurs, bordures, ombres
3. Remplacer progressivement le CSS custom par des utilitaires
4. Garder le CSS résiduel uniquement pour :
   - animations spécifiques
   - sélecteurs complexes
   - design tokens
   - utilities métier réutilisables

### Pour l’ajout de design tokens
- Préférer des tokens cohérents dans `@theme`
- Nommer clairement les tokens
- Réutiliser les tokens existants avant d’en créer de nouveaux
- Éviter les valeurs one-off si un token du système peut convenir

## Ce qu’il faut vérifier explicitement
Avant de finir, contrôler :
- le code compile
- les classes Tailwind existent vraiment
- les classes ne sont pas construites dynamiquement de façon cassante
- les états interactifs sont présents
- le dark mode est géré si le repo le supporte
- les composants partagés ne sont pas dupliqués inutilement
- les valeurs arbitraires sont justifiées
- aucune régression visuelle évidente n’a été introduite

## Patterns recommandés

### Bon réflexe
- Préférer :
  - `flex`, `grid`, `gap-*`
  - `px-*`, `py-*`, `space-*`
  - `text-*`, `font-*`, `leading-*`
  - `rounded-*`, `border`, `shadow-*`
  - `transition-*`, `duration-*`
  - `focus-visible:*`
  - variantes responsive et d’état simples

### Mauvais réflexe
- Empiler des dizaines de classes sans logique
- Utiliser des valeurs arbitraires partout
- Faire du CSS custom pour contourner une mauvaise structure HTML
- Générer des noms de classes à la volée côté JS si Tailwind ne peut pas les détecter
- Revenir à des patterns v3 sans raison

## Sortie attendue
Quand tu réponds :
- donne directement le code final
- garde les explications courtes et concrètes
- signale clairement :
  - ce que tu as changé
  - pourquoi c’est mieux
  - s’il y a un point à surveiller dans ce repo

## Si le repo est ambigu
Si la structure Tailwind du projet n’est pas claire :
- inspecter les fichiers CSS, `package.json`, PostCSS/Vite/Next config, composants partagés
- déduire la convention existante avant d’écrire
- s’aligner sur l’existant au lieu d’imposer une architecture arbitraire

## Notes importantes Tailwind v4
- Tailwind v4 repose sur une approche modernisée centrée sur le CSS et introduit de nouvelles directives dédiées.
- La détection des classes source reste critique : ne pas disperser des classes dans des chaînes illisibles ou générées dynamiquement sans précaution.
- Si un navigateur legacy doit être supporté, signaler que Tailwind v4 n’est pas adapté et que v3.4 peut être nécessaire.
