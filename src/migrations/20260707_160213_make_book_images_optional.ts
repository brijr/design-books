import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_books\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`title\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`summary\` text,
  	\`link\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_books\`("id", "image_id", "title", "author", "slug", "description", "summary", "link", "updated_at", "created_at") SELECT "id", "image_id", "title", "author", "slug", "description", "summary", "link", "updated_at", "created_at" FROM \`books\`;`,
  );
  await db.run(sql`DROP TABLE \`books\`;`);
  await db.run(sql`ALTER TABLE \`__new_books\` RENAME TO \`books\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(
    sql`CREATE INDEX \`books_image_idx\` ON \`books\` (\`image_id\`);`,
  );
  await db.run(
    sql`CREATE UNIQUE INDEX \`books_slug_idx\` ON \`books\` (\`slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`books_updated_at_idx\` ON \`books\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`books_created_at_idx\` ON \`books\` (\`created_at\`);`,
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_books\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`summary\` text,
  	\`link\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_books\`("id", "image_id", "title", "author", "slug", "description", "summary", "link", "updated_at", "created_at") SELECT "id", "image_id", "title", "author", "slug", "description", "summary", "link", "updated_at", "created_at" FROM \`books\`;`,
  );
  await db.run(sql`DROP TABLE \`books\`;`);
  await db.run(sql`ALTER TABLE \`__new_books\` RENAME TO \`books\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(
    sql`CREATE INDEX \`books_image_idx\` ON \`books\` (\`image_id\`);`,
  );
  await db.run(
    sql`CREATE UNIQUE INDEX \`books_slug_idx\` ON \`books\` (\`slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`books_updated_at_idx\` ON \`books\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`books_created_at_idx\` ON \`books\` (\`created_at\`);`,
  );
}
