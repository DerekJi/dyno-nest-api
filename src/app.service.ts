import { BaseDynamoModel } from '@core/models';
import { BaseDynamoService } from '@core/services';
import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class AppService extends BaseDynamoService<BaseDynamoModel> {
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected applyExpandParameters(items: Array<BaseDynamoModel>, expands?: Array<string>): Array<BaseDynamoModel> {
    if ((expands || []).length > 0) {
      
    }
    return items;
  }
}
