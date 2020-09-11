const AWS = require('aws-sdk');

const { TABLE_NAME, CLIENT_OPTIONS, TABLE_SCHEMA } = require('./dynamo-constants');

const db = new AWS.DynamoDB(CLIENT_OPTIONS);

{

  db.listTables(onListTables);

  /**
   * The callback function of db.listTables() to check if the table is created successfully or not.
   * 
   * @param {*} err 
   * @param {*} data 
   */
  function onCreateTable(err, data) {
    if (err) {
      console.error('Error creating table: ', err);
    } else {
      console.log("Success: Table Created!", data);
    }
  }

  /**
   * The callback function of db.listTables() to check if the table to be created exists or not.
   * 
   * @param {*} err 
   * @param {*} data 
   */
  function onListTables(err, data) {
    if (err) {
      console.error('Error listing tables: ', err);
      return;
    } else {
      const tables = data.TableNames || [];
      if (tables.length > 0 && tables.some(t => t === TABLE_NAME)) {
        console.error(`Error: the table ${TABLE_NAME} already exists.`);
        return;
      }

      db.createTable(TABLE_SCHEMA, onCreateTable);
    }
  }
}
