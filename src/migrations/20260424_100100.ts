import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_feat_prod_item_img_bg" AS ENUM('sable', 'ivoire', 'lagon', 'nuit');
  ALTER TABLE "pages_landing_content_featured_products_items" ADD COLUMN "image_background" "enum_feat_prod_item_img_bg" DEFAULT 'sable';
  ALTER TABLE "_pages_v_version_landing_content_featured_products_items" ADD COLUMN "image_background" "enum_feat_prod_item_img_bg" DEFAULT 'sable';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_pages_v_version_landing_content_featured_products_items" DROP COLUMN "image_background";
  ALTER TABLE "pages_landing_content_featured_products_items" DROP COLUMN "image_background";
  DROP TYPE "public"."enum_feat_prod_item_img_bg";
  `)
}
