## Setup Local DynamoDB

### Step #1. Prerequisites
* Make sure AWS CLI is installed;
* Run `aws configure` to setup credentials, region and format;

### Step #2. Download and start

DynamoDB Local is available
* as a download (requires JRE),
* as an Apache Maven dependency, or
* as a Docker image


IT IS RECOMMENDED TO USE *THE DOCKER IMAGE* AS IT IS THE EASIEST IN THIS WAY. But the official tutorial needs an extra command line for amendments:
```yaml
command: ["-jar", "DynamoDBLocal.jar", "-sharedDb", "-dbPath", "."]
```

Here is the updated compose file: [docker-compose.yml](docker-compose.yml)

Then, run the command simply to start the service:
```bash
# Enter the folder `dynamodb`
$ docker-compose up -d
```

Please check more details from the official document: [Deploying DynamoDB Locally on Your Computer](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)


### Step #3. Initialize the Table

*Option 1: Import data model via NoSQL Workbench.*
* On NoSQL Workbench, 'Import data model' from [`simple-application-data-model.json`](simple-application-data-model.json)
* `Visualize data model`
* `Commit to DynamoDB`

*Option 2: Import data model via cli*
Run the command
```bash
$ aws dynamodb create-table --cli-input-json file://simple-application-data-model.json --endpoint-url http://localhost:8000`
```

> References:
* [Deploying DynamoDB Locally on Your Computer](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)