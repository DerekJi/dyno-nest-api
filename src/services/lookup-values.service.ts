import { BaseDynamoModel, IFindOptions } from '@core/models';
import { IExpandOptions } from '@core/models/expand-options.interface';
import { BaseDynamoService } from '@core/services';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { AppService } from 'src/app.service';

@Injectable()
export class LookupValuesService extends AppService {
  protected readonly table: string = 'LookupValues';
  protected get db() { return new DynamoDB.DocumentClient(this.dynamoOptions); }

  protected readonly expandCandidates: IExpandOptions[] = [
    {
      key: 'kind'.toLowerCase(),
      pkMapFieldName: 'kind',
      skValue: 'LookupKinds',
      targetProperty: 'lookupKind',
    }
  ];

  /**
   * 
   * @param kind the value of the field 'kind'
   * @param options extra optional conditions
   */
  public async findAllByKindAsync(kind: string, options?: IFindOptions): Promise<BaseDynamoModel[] | InternalServerErrorException | NotFoundException> {
    const all = await this.findAllAsync(this.table, options);
    return (all as BaseDynamoModel[] || []).filter(x => x.kind === kind);
  }
}
