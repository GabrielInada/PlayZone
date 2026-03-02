import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageUrlToLocation1772403931200 implements MigrationInterface {
  name = 'AddImageUrlToLocation1772403931200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" ADD "imageUrl" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "imageUrl"`);
  }
}
