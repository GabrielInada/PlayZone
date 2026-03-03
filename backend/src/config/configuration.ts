const backendPort = parseInt(process.env.BACKEND_PORT ?? '3000', 10);
const parsedLocationImageUrlMaxLength = parseInt(
  process.env.LOCATION_IMAGE_URL_MAX_LENGTH ?? '200000',
  10,
);
const locationImageUrlMaxLength = Number.isNaN(parsedLocationImageUrlMaxLength)
  ? 200000
  : parsedLocationImageUrlMaxLength;

export default () => ({
  port: backendPort,
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT ?? '1mb',
  locationImageUrlMaxLength,
  nodeEnv: process.env.NODE_ENV,
  isVercel: process.env.VERCEL === '1' || Boolean(process.env.VERCEL_URL),
  dbPort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  dbUrl: process.env.DATABASE_URL,
  dbSynchronize: process.env.DB_SYNCHRONIZE,
  dbMigrationsRun: process.env.DB_MIGRATIONS_RUN,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,

  jwtSecret: process.env.JWT_SECRET,

  bootstrapAdminEnabled: process.env.BOOTSTRAP_ADMIN_ENABLED,
  bootstrapAdminAllowInProduction:
    process.env.BOOTSTRAP_ADMIN_ALLOW_IN_PRODUCTION,
  bootstrapAdminName: process.env.BOOTSTRAP_ADMIN_NAME,
  bootstrapAdminEmail: process.env.BOOTSTRAP_ADMIN_EMAIL,
  bootstrapAdminPassword: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  bootstrapAdminType: process.env.BOOTSTRAP_ADMIN_TYPE,
  bootstrapAdminCreateAllTypes: process.env.BOOTSTRAP_ADMIN_CREATE_ALL_TYPES,
});
