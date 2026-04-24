import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-1-2';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-2-3';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-3-4';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-4-5';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-5-6';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-6-7';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-7-8';
  ALTER TYPE "public"."enum_pages_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-8-1';

  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-1-2';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-2-3';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-3-4';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-4-5';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-5-6';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-6-7';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-7-8';
  ALTER TYPE "public"."enum__pages_v_version_landing_content_featured_products_items_image_background" ADD VALUE IF NOT EXISTS 'palette-8-1';

  ALTER TABLE "pages_landing_content_featured_products_items" ALTER COLUMN "image_background" SET DEFAULT 'palette-1-2';
  ALTER TABLE "_pages_v_version_landing_content_featured_products_items" ALTER COLUMN "image_background" SET DEFAULT 'palette-1-2';

  UPDATE "pages_landing_content_featured_products_items"
  SET "image_background" = CASE
    WHEN "image_background" = 'sable' THEN 'palette-1-2'
    WHEN "image_background" = 'ivoire' THEN 'palette-2-3'
    WHEN "image_background" = 'lagon' THEN 'palette-7-8'
    WHEN "image_background" = 'nuit' THEN 'palette-3-4'
    ELSE "image_background"
  END;

  UPDATE "_pages_v_version_landing_content_featured_products_items"
  SET "image_background" = CASE
    WHEN "image_background" = 'sable' THEN 'palette-1-2'
    WHEN "image_background" = 'ivoire' THEN 'palette-2-3'
    WHEN "image_background" = 'lagon' THEN 'palette-7-8'
    WHEN "image_background" = 'nuit' THEN 'palette-3-4'
    ELSE "image_background"
  END;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support dropping enum values safely.
  await db.execute(sql`
   UPDATE "pages_landing_content_featured_products_items"
  SET "image_background" = CASE
    WHEN "image_background" IN ('palette-1-2', 'palette-8-1') THEN 'sable'
    WHEN "image_background" IN ('palette-2-3', 'palette-7-8') THEN 'ivoire'
    WHEN "image_background" IN ('palette-5-6', 'palette-6-7') THEN 'lagon'
    WHEN "image_background" IN ('palette-3-4', 'palette-4-5') THEN 'nuit'
    ELSE "image_background"
  END;

  UPDATE "_pages_v_version_landing_content_featured_products_items"
  SET "image_background" = CASE
    WHEN "image_background" IN ('palette-1-2', 'palette-8-1') THEN 'sable'
    WHEN "image_background" IN ('palette-2-3', 'palette-7-8') THEN 'ivoire'
    WHEN "image_background" IN ('palette-5-6', 'palette-6-7') THEN 'lagon'
    WHEN "image_background" IN ('palette-3-4', 'palette-4-5') THEN 'nuit'
    ELSE "image_background"
  END;

  ALTER TABLE "pages_landing_content_featured_products_items" ALTER COLUMN "image_background" SET DEFAULT 'sable';
  ALTER TABLE "_pages_v_version_landing_content_featured_products_items" ALTER COLUMN "image_background" SET DEFAULT 'sable';
  `)
}
