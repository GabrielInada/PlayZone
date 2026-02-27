const backendPort = parseInt(process.env.BACKEND_PORT ?? '3000', 10);

export default () => ({
  port: backendPort,
  nodeEnv: process.env.NODE_ENV,
  dbPort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  dbUrl: process.env.DATABASE_URL,
  dbSynchronize: process.env.DB_SYNCHRONIZE,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,
  
  jwtSecret: process.env.JWT_SECRET,
  
  bootstrapAdminEnabled: process.env.BOOTSTRAP_ADMIN_ENABLED,
  bootstrapAdminAllowInProduction:process.env.BOOTSTRAP_ADMIN_ALLOW_IN_PRODUCTION,
  bootstrapAdminName: process.env.BOOTSTRAP_ADMIN_NAME,
  bootstrapAdminEmail: process.env.BOOTSTRAP_ADMIN_EMAIL,
  bootstrapAdminPassword: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  bootstrapAdminType: process.env.BOOTSTRAP_ADMIN_TYPE,
});