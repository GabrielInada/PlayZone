
const backendPort = parseInt(process.env.BACKEND_PORT ?? '3000', 10);

export default () => ({
  port: backendPort,
  dbPort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  dbUrl: process.env.DATABASE_URL,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,
});