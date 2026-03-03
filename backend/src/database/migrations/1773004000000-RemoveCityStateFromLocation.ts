import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCityStateFromLocation1773004000000
  implements MigrationInterface
{
  name = 'RemoveCityStateFromLocation1773004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN IF EXISTS "city"`);
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN IF EXISTS "state"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ADD COLUMN IF NOT EXISTS "city" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD COLUMN IF NOT EXISTS "state" character varying`,
    );
  }
}
