import { BaseDynamoModel } from '@core/models';
import { IExpandOptions } from '@core/models/expand-options.interface';
import { BaseDynamoService } from '@core/services';
import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class AppService extends BaseDynamoService<BaseDynamoModel> {
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected readonly expandCandidates: IExpandOptions[] = [
    {
      // The keyword specified in the query parameter 'expand'
      key: 'organisation'.toLowerCase(),

      // The column name which maps to the 'pk' column of the foreign key's table
      pkMapFieldName: 'organisationId',
      
      // The name of the foreign key's table
      skValue: 'Organisations',

      // The property name included in the response body
      targetProperty: 'organisation',
    }
  ];
}
