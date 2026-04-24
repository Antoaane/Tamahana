import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE
    tbl_name text;
    col_name text;
  BEGIN
    FOR tbl_name IN
      SELECT unnest(ARRAY[
        'pages',
        '_pages_v'
      ])
    LOOP
      FOR col_name IN
        SELECT unnest(
          CASE
            WHEN tbl_name = 'pages' THEN ARRAY[
              'landing_content_waitlist_description',
              'landing_content_waitlist_success_message',
              'landing_content_story_introduction',
              'landing_content_materials_content',
              'landing_content_designs_content'
            ]
            ELSE ARRAY[
              'version_landing_content_waitlist_description',
              'version_landing_content_waitlist_success_message',
              'version_landing_content_story_introduction',
              'version_landing_content_materials_content',
              'version_landing_content_designs_content'
            ]
          END
        )
      LOOP
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = tbl_name
            AND column_name = col_name
        ) THEN
          EXECUTE format(
            $alter$
              ALTER TABLE public.%I
              ALTER COLUMN %I TYPE jsonb
              USING (
                CASE
                  WHEN %I IS NULL OR btrim(%I::text) = '' THEN NULL
                  ELSE jsonb_build_object(
                    'root',
                    jsonb_build_object(
                      'type', 'root',
                      'children', jsonb_build_array(
                        jsonb_build_object(
                          'type', 'paragraph',
                          'children', jsonb_build_array(
                            jsonb_build_object(
                              'type', 'text',
                              'detail', 0,
                              'format', 0,
                              'mode', 'normal',
                              'style', '',
                              'text', %I::text,
                              'version', 1
                            )
                          ),
                          'direction', 'ltr',
                          'format', '',
                          'indent', 0,
                          'textFormat', 0,
                          'version', 1
                        )
                      ),
                      'direction', 'ltr',
                      'format', '',
                      'indent', 0,
                      'version', 1
                    )
                  )
                END
              )
            $alter$,
            tbl_name,
            col_name,
            col_name,
            col_name,
            col_name
          );
        END IF;
      END LOOP;
    END LOOP;
  END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE
    tbl_name text;
    col_name text;
  BEGIN
    FOR tbl_name IN
      SELECT unnest(ARRAY[
        'pages',
        '_pages_v'
      ])
    LOOP
      FOR col_name IN
        SELECT unnest(
          CASE
            WHEN tbl_name = 'pages' THEN ARRAY[
              'landing_content_waitlist_description',
              'landing_content_waitlist_success_message',
              'landing_content_story_introduction',
              'landing_content_materials_content',
              'landing_content_designs_content'
            ]
            ELSE ARRAY[
              'version_landing_content_waitlist_description',
              'version_landing_content_waitlist_success_message',
              'version_landing_content_story_introduction',
              'version_landing_content_materials_content',
              'version_landing_content_designs_content'
            ]
          END
        )
      LOOP
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = tbl_name
            AND column_name = col_name
        ) THEN
          EXECUTE format(
            $alter$
              ALTER TABLE public.%I
              ALTER COLUMN %I TYPE varchar
              USING (
                CASE
                  WHEN %I IS NULL THEN NULL
                  ELSE COALESCE(%I #>> '{root,children,0,children,0,text}', %I::text)
                END
              )
            $alter$,
            tbl_name,
            col_name,
            col_name,
            col_name,
            col_name
          );
        END IF;
      END LOOP;
    END LOOP;
  END $$;
  `)
}
