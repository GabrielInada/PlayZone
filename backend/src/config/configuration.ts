const backendPort = parseInt(process.env.BACKEND_PORT ?? '3000', 10);
const isServerlessRuntime =
  process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

export default () => ({
  port: backendPort,
  dbPort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  dbUrl: process.env.DATABASE_URL,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,
  isServerlessRuntime,
});