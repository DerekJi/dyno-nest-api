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
* Run the batch script [`create-local-db.bat`](create-local-db.bat)

> References:
* [Deploying DynamoDB Locally on Your Computer](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)