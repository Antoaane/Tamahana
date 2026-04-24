import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_landing_content_social_links_items_icon" ADD VALUE IF NOT EXISTS 'tiktok';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_social_links_items_icon" ADD VALUE IF NOT EXISTS 'tiktok';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support dropping a single enum value safely.
  await db.execute(sql`SELECT 1;`)
}
