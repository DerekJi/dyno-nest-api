import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { BaseDynamoService } from '@core/services';
import { UserDynamoModel } from './models/user-dynamo-model';

@Injectable()
export class UsersApiService extends BaseDynamoService<UserDynamoModel> {
  protected serviceSortKey = 'USER';
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected applyExpandParameters(items: Array<UserDynamoModel>, expands?: Array<string>): Array<UserDynamoModel> {
    if ((expands || []).length > 0) {
      
    }
    return items;
  }
}
