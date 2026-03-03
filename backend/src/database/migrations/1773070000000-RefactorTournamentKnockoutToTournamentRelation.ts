import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorTournamentKnockoutToTournamentRelation1773070000000
  implements MigrationInterface
{
  name = 'RefactorTournamentKnockoutToTournamentRelation1773070000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tournament" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tournament_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tournament_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "tournament" ("name")
      SELECT DISTINCT tk."tournamentName"
      FROM "tournament_knockout" tk
      WHERE tk."tournamentName" IS NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD COLUMN "tournamentId" integer
    `);

    await queryRunner.query(`
      UPDATE "tournament_knockout" tk
      SET "tournamentId" = t."id"
      FROM "tournament" t
      WHERE t."name" = tk."tournamentName"
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ALTER COLUMN "tournamentId" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ALTER COLUMN "slot" DROP NOT NULL
    `);

    await queryRunner.query(
      `ALTER TABLE "tournament_knockout" DROP CONSTRAINT IF EXISTS "UQ_tournament_knockout_stage_slot"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_tournament_knockout_stage_slot"`,
    );

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD CONSTRAINT "FK_tournament_knockout_tournamentId"
      FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD CONSTRAINT "UQ_tournament_knockout_tournament_stage_slot"
      UNIQUE ("tournamentId", "stage", "slot")
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      DROP COLUMN "tournamentName"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD COLUMN "tournamentName" character varying
    `);

    await queryRunner.query(`
      UPDATE "tournament_knockout" tk
      SET "tournamentName" = t."name"
      FROM "tournament" t
      WHERE t."id" = tk."tournamentId"
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ALTER COLUMN "tournamentName" SET NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "tournament_knockout"
      SET "slot" = COALESCE("slot", "id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ALTER COLUMN "slot" SET NOT NULL
    `);

    await queryRunner.query(
      `ALTER TABLE "tournament_knockout" DROP CONSTRAINT IF EXISTS "UQ_tournament_knockout_tournament_stage_slot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_knockout" DROP CONSTRAINT IF EXISTS "FK_tournament_knockout_tournamentId"`,
    );

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD CONSTRAINT "UQ_tournament_knockout_stage_slot"
      UNIQUE ("tournamentName", "stage", "slot")
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      DROP COLUMN "tournamentId"
    `);

    await queryRunner.query(`DROP TABLE "tournament"`);
  }
}
