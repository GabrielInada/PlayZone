import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCapacityToLocation1772465765452 implements MigrationInterface {
    name = 'AddCapacityToLocation1772465765452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "capacity" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "capacity"`);
    }

}
