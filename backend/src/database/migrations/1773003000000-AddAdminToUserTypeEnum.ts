import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminToUserTypeEnum1773003000000
  implements MigrationInterface
{
  name = 'AddAdminToUserTypeEnum1773003000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "user_type_enum" ADD VALUE IF NOT EXISTS 'admin'`,
    );
  }

  public async down(): Promise<void> {
    // PostgreSQL does not support removing enum values safely in a simple down migration.
  }
}
