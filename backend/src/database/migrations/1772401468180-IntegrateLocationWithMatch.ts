import { MigrationInterface, QueryRunner } from "typeorm";

export class IntegrateLocationWithMatch1772401468180 implements MigrationInterface {
    name = 'IntegrateLocationWithMatch1772401468180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" text, "city" character varying, "state" character varying, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);

        await queryRunner.query(`
            INSERT INTO "location" ("name", "createdAt", "updatedAt")
            SELECT DISTINCT m."location", NOW(), NOW()
            FROM "match" m
            WHERE m."location" IS NOT NULL
        `);

        await queryRunner.query(`ALTER TABLE "match" ADD "locationId" integer`);

        await queryRunner.query(`
            UPDATE "match" m
            SET "locationId" = l."id"
            FROM "location" l
            WHERE l."name" = m."location"
        `);

        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "locationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_e07b88f570ffba262eda9127a36" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_e07b88f570ffba262eda9127a36"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "location" character varying`);

        await queryRunner.query(`
            UPDATE "match" m
            SET "location" = l."name"
            FROM "location" l
            WHERE l."id" = m."locationId"
        `);

        await queryRunner.query(`UPDATE "match" SET "location" = '' WHERE "location" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "location" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "locationId"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
