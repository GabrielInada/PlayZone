import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { EnumUserRole, EnumUserType } from '../../types/user';

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
    const adminPassword = this.configService.get<string>('bootstrapAdminPassword');
    const adminTypeRaw =
      this.configService.get<string>('bootstrapAdminType') ||
      EnumUserType.DELEGADO;

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

    const normalizedEmail = adminEmail.toLowerCase();
    const foundUser = await this.userService.findByEmail(normalizedEmail);

    if (foundUser) {
      if (foundUser.role === EnumUserRole.ADMIN) {
        this.logger.log('Bootstrap admin already exists. Skipping creation.');
        return;
      }

      this.logger.warn(
        `Bootstrap admin email already belongs to a non-admin user (${normalizedEmail}). Skipping creation.`,
      );
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await this.userService.createWithRole({
      name: adminName,
      email: normalizedEmail,
      password: passwordHash,
      type: adminTypeRaw as EnumUserType,
    }, EnumUserRole.ADMIN);

    this.logger.log(`Bootstrap admin created: ${normalizedEmail}`);
  }

  private readBoolean(value: string | undefined): boolean {
    return value === 'true' || value === '1';
  }
}
