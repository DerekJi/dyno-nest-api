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
      key: 'taskRecipients'.toLowerCase(),
      pkMapFieldName: 'pk',
      skValue: 'USER',
      targetProperty: 'taskRecipients',
    },
    {
      key: 'lga'.toLowerCase(),
      pkMapFieldName: 'lgaKey',
      skValue: 'LGA',
      targetProperty: 'LocalGovernmentArea',
    }
  ];
}
