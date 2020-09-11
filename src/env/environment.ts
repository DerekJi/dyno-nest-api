export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 8000,
    // table: 'LGADataPortalData',
    table: 'SimpleApplicationData',
    region: 'ap-southeast-2',
    endpoint: 'http://localhost:8000',
    gsi_1: 'gsi_1',
  }
});