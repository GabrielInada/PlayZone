import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStandingTable1773000000000 implements MigrationInterface {
  name = 'CreateStandingTable1773000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "standing" (
        "id" SERIAL NOT NULL,
        "teamId" integer NOT NULL,
        "teamName" character varying NOT NULL,
        "points" integer NOT NULL DEFAULT '0',
        "games" integer NOT NULL DEFAULT '0',
        "wins" integer NOT NULL DEFAULT '0',
        "draws" integer NOT NULL DEFAULT '0',
        "losses" integer NOT NULL DEFAULT '0',
        "gf" integer NOT NULL DEFAULT '0',
        "ga" integer NOT NULL DEFAULT '0',
        "gd" integer NOT NULL DEFAULT '0',
        "position" integer NOT NULL DEFAULT '0',
        "lastUpdatedAt" TIMESTAMP,
        CONSTRAINT "PK_standing_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_standing_teamId" ON "standing" ("teamId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_standing_teamId"`);
    await queryRunner.query(`DROP TABLE "standing"`);
  }
}
