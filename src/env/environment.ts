export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    urlAuthEnabled: false,
    apiKeyAuthEnabled: false,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 8000,
    table: 'LMS',
    region: 'ap-southeast-2',
    endpoint: 'http://localhost:8000',
    gsi_1: 'gsi_1',
  }
});