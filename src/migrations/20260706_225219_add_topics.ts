import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`topics\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`description\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`);
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`topics_slug_idx\` ON \`topics\` (\`slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`topics_updated_at_idx\` ON \`topics\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`topics_created_at_idx\` ON \`topics\` (\`created_at\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`books_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`topics_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`books\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`topics_id\`) REFERENCES \`topics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`books_rels_order_idx\` ON \`books_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`books_rels_parent_idx\` ON \`books_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`books_rels_path_idx\` ON \`books_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`books_rels_topics_id_idx\` ON \`books_rels\` (\`topics_id\`);`,
  );

  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`topics_id\` integer;`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_topics_id_idx\` ON \`payload_locked_documents_rels\` (\`topics_id\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`books_rels\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`topics\`;`);
}
