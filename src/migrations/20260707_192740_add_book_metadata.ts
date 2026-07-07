import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`books\` ADD \`publisher\` text;`);
  await db.run(sql`ALTER TABLE \`books\` ADD \`year\` text;`);
  await db.run(sql`ALTER TABLE \`books\` ADD \`pages\` text;`);
  await db.run(sql`ALTER TABLE \`books\` ADD \`isbn\` text;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`books\` DROP COLUMN \`publisher\`;`);
  await db.run(sql`ALTER TABLE \`books\` DROP COLUMN \`year\`;`);
  await db.run(sql`ALTER TABLE \`books\` DROP COLUMN \`pages\`;`);
  await db.run(sql`ALTER TABLE \`books\` DROP COLUMN \`isbn\`;`);
}
