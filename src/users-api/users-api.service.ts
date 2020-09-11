import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { BaseDynamoModel } from '@core/models';
import { BaseDynamoService } from '@core/services';

@Injectable()
export class UsersApiService extends BaseDynamoService<BaseDynamoModel> {
  protected serviceSortKey = 'USER';
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected applyExpandParameters(items: Array<BaseDynamoModel>, expands?: Array<string>): Array<BaseDynamoModel> {
    if ((expands || []).length > 0) {
      
    }
    return items;
  }
}
