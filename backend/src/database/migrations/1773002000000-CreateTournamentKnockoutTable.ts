import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTournamentKnockoutTable1773002000000 implements MigrationInterface {
  name = 'CreateTournamentKnockoutTable1773002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tournament_knockout" (
        "id" SERIAL NOT NULL,
        "tournamentName" character varying NOT NULL,
        "stage" character varying NOT NULL,
        "roundOrder" integer NOT NULL DEFAULT '1',
        "slot" integer NOT NULL,
        "matchId" integer NOT NULL,
        "winnerTeamId" integer,
        "isDecided" boolean NOT NULL DEFAULT false,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tournament_knockout_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tournament_knockout_matchId" UNIQUE ("matchId"),
        CONSTRAINT "UQ_tournament_knockout_stage_slot" UNIQUE ("tournamentName", "stage", "slot")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD CONSTRAINT "FK_tournament_knockout_matchId"
      FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "tournament_knockout"
      ADD CONSTRAINT "FK_tournament_knockout_winnerTeamId"
      FOREIGN KEY ("winnerTeamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_knockout" DROP CONSTRAINT "FK_tournament_knockout_winnerTeamId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_knockout" DROP CONSTRAINT "FK_tournament_knockout_matchId"`,
    );
    await queryRunner.query(`DROP TABLE "tournament_knockout"`);
  }
}
