// ------------ NodeJS runtime ---------------
// Add aws-sdk in package.json as a dependency
// Example:
// {
//     "dependencies": {
//         "aws-sdk": "^2.0.9",
//     }
// }
// Create your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users)
// Format of the above file should be:
//  [default]
//  aws_access_key_id = YOUR_ACCESS_KEY_ID
//  aws_secret_access_key = YOUR_SECRET_ACCESS_KEY

const AWS = require('../../node_modules/aws-sdk');

// Create the DynamoDB Client with the region you want
const options = {
    region: 'ap-southeast-2',
    endpoint: 'http://localhost:8000',
};

const dynamoDbClient = createDynamoDbClient(options);

// Create the input for query call
const queryInput = createQueryInput();

 // Call DynamoDB's query API
executeQuery(dynamoDbClient, queryInput).then(() => {
    console.info('Query API call has been executed.')
  }
);

function createDynamoDbClient(options) {
  // Set the region
  AWS.config.update(options);
  // Use the following config instead when using DynamoDB Local
  // AWS.config.update({region: 'localhost', endpoint: 'http://localhost:8000', accessKeyId: 'access_key_id', secretAccessKey: 'secret_access_key'});
  return new AWS.DynamoDB();
}

function createQueryInput() {
return {
  "TableName": "LGADataPortalData",
  "ScanIndexForward": false,
  "ConsistentRead": false,
  "KeyConditionExpression": "#bef90 = :bef90 And begins_with(#bef91, :bef91)",
  "ExpressionAttributeValues": {
    ":bef90": {
      "S": "TASK#17d38440-fd63-448e-ad2f-ce82f5a0468f"
    },
    ":bef91": {
      "S": "USER"
    }
  },
  "ExpressionAttributeNames": {
    "#bef90": "pk",
    "#bef91": "sk"
  }
}
}

async function executeQuery(dynamoDbClient, queryInput) {
  // Call DynamoDB's query API
  try {
    console.log(queryInput);
    const queryOutput = await dynamoDbClient.query(queryInput).promise();
    console.info('Query successful.');
    // Handle queryOutput
    // console.log(queryOutput);
  } catch (err) {
    handleQueryError(err);
  }
}

// Handles errors during Query execution. Use recommendations in error messages below to 
// add error handling specific to your application use-case. 
function handleQueryError(err) {
  if (!err) {
    console.error('Encountered error object was empty');
    return;
  }
  if (!err.code) {
    console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
    return;
  }
  // here are no API specific errors to handle for Query, common DynamoDB API errors are handled below
  handleCommonErrors(err);
}

function handleCommonErrors(err) {
  switch (err.code) {
    case 'InternalServerError':
      console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;
    case 'ProvisionedThroughputExceededException':
      console.error(`Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` 
        + `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
      return;
    case 'ResourceNotFoundException':
      console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
      return;
    case 'ServiceUnavailable':
      console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;      
    case 'ThrottlingException':
      console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;
    case 'UnrecognizedClientException':
      console.error(`The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` 
        + `Error: ${err.message}`);
      return;
    case 'ValidationException':
      console.error(`The input fails to satisfy the constraints specified by DynamoDB, `
        + `fix input before retrying. Error: ${err.message}`);
      return;
    case 'RequestLimitExceeded':
      console.error(`Throughput exceeds the current throughput limit for your account, `
        + `increase account level throughput before retrying. Error: ${err.message}`);
      return;
    default:
      console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
      return;
  }
}
