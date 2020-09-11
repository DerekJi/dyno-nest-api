const TABLE_NAME = 'SimpleApplicationData';

const CLIENT_OPTIONS = {
  region: 'ap-southeast-2',
  endpoint: 'http://localhost:8000',
};

const TABLE_SCHEMA = {
  "TableName": TABLE_NAME,
  "KeySchema": [
    {
      "AttributeName": "pk",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "sk",
      "KeyType": "RANGE"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "pk",
      "AttributeType": "S"
    },
    {
      "AttributeName": "sk",
      "AttributeType": "S"
    },
    {
      "AttributeName": "data",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "gsi_1",
      "KeySchema": [
        {
          "AttributeName": "sk",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "data",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      },
      "ProvisionedThroughput": {        
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    }    
  ],
  "ProvisionedThroughput": {
    "WriteCapacityUnits": 1,
    "ReadCapacityUnits": 1
  }
};

module.exports = {
  TABLE_NAME, CLIENT_OPTIONS, TABLE_SCHEMA 
};
