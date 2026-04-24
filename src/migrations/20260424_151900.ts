import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "product_likes" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_key" varchar NOT NULL,
    "likes" numeric DEFAULT 0 NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels"
  ADD COLUMN IF NOT EXISTS "product_likes_id" integer;

  CREATE UNIQUE INDEX IF NOT EXISTS "product_likes_product_key_idx"
  ON "product_likes" USING btree ("product_key");

  CREATE INDEX IF NOT EXISTS "product_likes_updated_at_idx"
  ON "product_likes" USING btree ("updated_at");

  CREATE INDEX IF NOT EXISTS "product_likes_created_at_idx"
  ON "product_likes" USING btree ("created_at");

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_product_likes_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_product_likes_fk"
      FOREIGN KEY ("product_likes_id") REFERENCES "public"."product_likes"("id")
      ON DELETE cascade
      ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_likes_id_idx"
  ON "payload_locked_documents_rels" USING btree ("product_likes_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels"
  DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_product_likes_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_likes_id_idx";
  DROP INDEX IF EXISTS "product_likes_created_at_idx";
  DROP INDEX IF EXISTS "product_likes_updated_at_idx";
  DROP INDEX IF EXISTS "product_likes_product_key_idx";

  ALTER TABLE "payload_locked_documents_rels"
  DROP COLUMN IF EXISTS "product_likes_id";

  DROP TABLE IF EXISTS "product_likes";
  `)
}
