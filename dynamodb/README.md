## Setup Local DynamoDB

### Step #1. Prerequisites
* Make sure Java environment is set;
* Make sure AWS CLI is installed;
* Run `aws configure` to setup credentials, region and format;

### Step #2. Download and start
* Download DynamoDB 
* Decompress the zipped files into `C:\dynamodb\`;
* Start local dynamodb: run the batch script [`start-local-db.bat`](start-local-db.bat)

### Step #3. Create Table
* On NoSQL Workbench, 'Import data model' from [`simple-application-data-model.json`](simple-application-data-model.json)
* `Visualize data model`
* `Commit to DynamoDB`

> References:
* [Deploying DynamoDB Locally on Your Computer](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)