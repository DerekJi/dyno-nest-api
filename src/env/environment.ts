const isDevelopment = process.env.ENVIRONMENT?.toLowerCase().indexOf('lambda') >= 0 ? false : true;

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    urlAuthEnabled: false,
    apiKeyAuthEnabled: false,
  },
  database: {
    isDevelopment,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 8000,
    // table: 'LGADataPortalData',
    table: isDevelopment ? 'SimpleApplicationDataModel' : 'SimpleApplicationDataService',
    region: 'ap-southeast-2',
    endpoint: isDevelopment ? 'http://localhost:8000' : null,
    gsi_1: 'gsi_1',
  }
});