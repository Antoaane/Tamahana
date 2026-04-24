import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
  DECLARE
    enum_type_text text;
    enum_value text;
    tbl_name text;
  BEGIN
    -- Resolve enum type from actual table metadata (robust to identifier truncation / custom enumName).
    FOR tbl_name IN
      SELECT unnest(ARRAY[
        'pages_landing_content_featured_products_items',
        '_pages_v_version_landing_content_featured_products_items'
      ])
    LOOP
      SELECT a.atttypid::regtype::text
      INTO enum_type_text
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = tbl_name
        AND a.attname = 'image_background'
        AND a.attnum > 0
        AND NOT a.attisdropped;

      IF enum_type_text IS NOT NULL THEN
        FOREACH enum_value IN ARRAY ARRAY[
          'palette-1-2',
          'palette-2-3',
          'palette-3-4',
          'palette-4-5',
          'palette-5-6',
          'palette-6-7',
          'palette-7-8',
          'palette-8-1'
        ]
        LOOP
          EXECUTE format('ALTER TYPE %s ADD VALUE IF NOT EXISTS %L', enum_type_text, enum_value);
        END LOOP;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl_name
          AND column_name = 'image_background'
      ) THEN
        EXECUTE format(
          'ALTER TABLE %I.%I ALTER COLUMN %I SET DEFAULT %L',
          'public',
          tbl_name,
          'image_background',
          'palette-1-2'
        );

        EXECUTE format(
          'UPDATE %I.%I SET %I = CASE
            WHEN %I = %L THEN %L
            WHEN %I = %L THEN %L
            WHEN %I = %L THEN %L
            WHEN %I = %L THEN %L
            ELSE %I
          END',
          'public',
          tbl_name,
          'image_background',
          'image_background',
          'sable',
          'palette-1-2',
          'image_background',
          'ivoire',
          'palette-2-3',
          'image_background',
          'lagon',
          'palette-7-8',
          'image_background',
          'nuit',
          'palette-3-4',
          'image_background'
        );
      END IF;
    END LOOP;
  END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support dropping enum values safely.
  await db.execute(sql`
  DO $$
  DECLARE
    tbl_name text;
  BEGIN
    FOR tbl_name IN
      SELECT unnest(ARRAY[
        'pages_landing_content_featured_products_items',
        '_pages_v_version_landing_content_featured_products_items'
      ])
    LOOP
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl_name
          AND column_name = 'image_background'
      ) THEN
        EXECUTE format(
          'UPDATE %I.%I SET %I = CASE
            WHEN %I IN (%L, %L) THEN %L
            WHEN %I IN (%L, %L) THEN %L
            WHEN %I IN (%L, %L) THEN %L
            WHEN %I IN (%L, %L) THEN %L
            ELSE %I
          END',
          'public',
          tbl_name,
          'image_background',
          'image_background',
          'palette-1-2',
          'palette-8-1',
          'sable',
          'image_background',
          'palette-2-3',
          'palette-7-8',
          'ivoire',
          'image_background',
          'palette-5-6',
          'palette-6-7',
          'lagon',
          'image_background',
          'palette-3-4',
          'palette-4-5',
          'nuit',
          'image_background'
        );

        EXECUTE format(
          'ALTER TABLE %I.%I ALTER COLUMN %I SET DEFAULT %L',
          'public',
          tbl_name,
          'image_background',
          'sable'
        );
      END IF;
    END LOOP;
  END $$;
  `)
}
