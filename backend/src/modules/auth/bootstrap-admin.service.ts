import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { EnumUserRole, EnumUserType } from '../../types/user';

const ALL_ADMIN_TYPES: EnumUserType[] = [
  EnumUserType.ADMIN,
  EnumUserType.JOGADOR,
  EnumUserType.CLUBE,
  EnumUserType.DELEGADO,
];

@Injectable()
export class BootstrapAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapAdminService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async onApplicationBootstrap() {
    const enabled = this.readBoolean(
      this.configService.get<string>('bootstrapAdminEnabled'),
    );

    if (!enabled) return;

    const nodeEnv = this.configService.get<string>('nodeEnv');
    const allowInProduction = this.readBoolean(
      this.configService.get<string>('bootstrapAdminAllowInProduction'),
    );

    if (nodeEnv === 'production' && !allowInProduction) {
      this.logger.warn(
        'Admin bootstrap is enabled but blocked in production. Set BOOTSTRAP_ADMIN_ALLOW_IN_PRODUCTION=true to allow it intentionally.',
      );
      return;
    }

    const adminName =
      this.configService.get<string>('bootstrapAdminName') || 'Administrator';
    const adminEmail = this.configService.get<string>('bootstrapAdminEmail');
    const adminPassword = this.configService.get<string>(
      'bootstrapAdminPassword',
    );
    const adminTypeRaw =
      this.configService.get<string>('bootstrapAdminType') ||
      EnumUserType.DELEGADO;
    const createAllTypes = this.readBoolean(
      this.configService.get<string>('bootstrapAdminCreateAllTypes'),
    );

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required when BOOTSTRAP_ADMIN_ENABLED=true',
      );
    }

    if (adminPassword.length < 10) {
      throw new Error(
        'BOOTSTRAP_ADMIN_PASSWORD must have at least 10 characters',
      );
    }

    if (!Object.values(EnumUserType).includes(adminTypeRaw as EnumUserType)) {
      throw new Error(
        `Invalid BOOTSTRAP_ADMIN_TYPE: ${adminTypeRaw}. Allowed values: ${Object.values(EnumUserType).join(', ')}`,
      );
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const normalizedBaseEmail = adminEmail.toLowerCase();

    if (createAllTypes) {
      for (const type of ALL_ADMIN_TYPES) {
        const emailForType = this.buildEmailForType(normalizedBaseEmail, type);
        const nameForType = `${adminName} (${type})`;

        await this.createOrSkipAdmin({
          email: emailForType,
          name: nameForType,
          type,
          passwordHash,
        });
      }

      return;
    }

    await this.createOrSkipAdmin({
      email: normalizedBaseEmail,
      name: adminName,
      type: adminTypeRaw as EnumUserType,
      passwordHash,
    });
  }

  private async createOrSkipAdmin(params: {
    email: string;
    name: string;
    type: EnumUserType;
    passwordHash: string;
  }) {
    const { email, name, type, passwordHash } = params;

    const foundUser = await this.userService.findByEmail(email);

    if (foundUser) {
      if (foundUser.role === EnumUserRole.ADMIN) {
        this.logger.log(`Bootstrap admin already exists (${email}). Skipping.`);
        return;
      }

      this.logger.warn(
        `Bootstrap admin email already belongs to a non-admin user (${email}). Skipping creation.`,
      );
      return;
    }

    try {
      await this.userService.createWithRole(
        {
          name,
          email,
          password: passwordHash,
          type,
        },
        EnumUserRole.ADMIN,
      );

      this.logger.log(`Bootstrap admin created: ${email} (${type})`);
    } catch (error) {
      const conflictByUniqueEmail =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === '23505';

      if (!conflictByUniqueEmail) {
        throw error;
      }

      const userAfterConflict = await this.userService.findByEmail(email);

      if (userAfterConflict?.role === EnumUserRole.ADMIN) {
        this.logger.log(
          `Bootstrap admin already created by another instance (${email}). Skipping.`,
        );
        return;
      }

      this.logger.warn(
        `Bootstrap admin email already exists with non-admin role (${email}). Skipping creation.`,
      );
    }
  }

  private buildEmailForType(baseEmail: string, type: EnumUserType): string {
    if (type === EnumUserType.ADMIN) {
      return baseEmail;
    }

    const atIndex = baseEmail.indexOf('@');
    if (atIndex <= 0 || atIndex === baseEmail.length - 1) {
      throw new Error(
        `BOOTSTRAP_ADMIN_EMAIL must be a valid email to generate all types. Received: ${baseEmail}`,
      );
    }

    const local = baseEmail.slice(0, atIndex);
    const domain = baseEmail.slice(atIndex + 1);
    return `${local}+${type}@${domain}`;
  }

  private readBoolean(value: string | undefined): boolean {
    return value === 'true' || value === '1';
  }
}
