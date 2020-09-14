import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { Guid } from "guid-typescript";
import DynamoDB, { UpdateItemInput } from 'aws-sdk/clients/dynamodb';

import { BaseDynamoModel, DatabaseConfigEnv, IFindOptions } from '@core/models';

@Injectable()
export abstract class BaseDynamoService<T extends BaseDynamoModel> {

  
  /**
   * 
   * @param pk pk string
   * @param expand 
   */
  public async findByKeyAsync(sk: string, pk: string): Promise<T | InternalServerErrorException | NotFoundException> {
    const params = {
      TableName: this.DbConfig?.table,
      Key:{ pk, sk }
    };

    let result;
    try {
      const promise = await this.db.get(params).promise();
      result = promise.Item;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
    
    if (!result) {
      return new NotFoundException('Not Found');
    }
    
    return result;
  }

  /**
   * 
   * @param options extra optional conditions
   */
  public async findAllAsync(sk: string, options?: IFindOptions): Promise<T[] | InternalServerErrorException | NotFoundException> {
    const params = {
      TableName: this.DbConfig?.table,
      IndexName: this.DbConfig?.gsi_1,
      KeyConditionExpression: "#sk = :sk",
      ExpressionAttributeNames: { "#sk": "sk" },
      ExpressionAttributeValues: { ":sk": sk },
    };

    let result;
    try {
      const promise = await this.db.query(params).promise();
      result = promise.Items;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
    
    if (!result) {
      return new NotFoundException('Not Found');
    }
    
    if (options) {
      result = ([true, false].indexOf(options.enabled) < 0) ? result : result.filter((x) => x.Enabled === +options.enabled);
    }

    return result;
  }

  /**
   * Create a new record
   * 
   * @param model the item to be created
   */
  public async createAsync(sk: string, model: T): Promise<T | InternalServerErrorException | NotFoundException> {
    const now = new Date().toISOString();

    model.pk = sk + '#' + Guid.create().toString();
    model.sk = sk;
    model.data = model.name;
    model.createdOn = now;

    const params = {
      TableName: this.DbConfig?.table,
      Item: model,
    };

    let result;
    try {
      await this.db.put(params).promise();
      result = Object.assign({}, model);
    } catch (error) {
      return new InternalServerErrorException(error);
    }

    return result;
  }


  /**
   * Update an existing record
   * 
   * @param model the item to be updated
   */
  public async updateAsync(sk: string, model: T): Promise<T | InternalServerErrorException | NotFoundException> {
    const now = new Date().toISOString();
    model.modifiedOn = model.modifiedOn || now;

    const params = this.buildUpdateItemParams(model);

    if (!params) {
      return new InternalServerErrorException('Invalid input');
    }

    let result;
    try {
      const promise = await this.db.update(params).promise();
      result = promise;
    } catch (error) {
      return new InternalServerErrorException(error);
    }

    return result;
  }

  /**
   * 
   * @param model 
   */
  protected buildUpdateItemParams(model: T): any {
    if (!model || !model.pk || !model.sk) {
      return null;
    }

    const updateExpressions: string[] = [];
    const attributeNames: any = {};
    const attributeValues: any = {};
    for (const [key, value] of Object.entries(model)) {
      const skipKeys = ['pk', 'sk', 'createdOn', 'createdBy', 'modifiedBy'];
      if (skipKeys.indexOf(key) < 0) {
        const updateExpr = `#${key} = :${key}`;
        updateExpressions.push(updateExpr);
        attributeNames[`#${key}`] = key;

        let itemValue = value;
        switch (key) {
          case 'modifiedOn':
            itemValue = new Date().toISOString();
            break;
          case 'data':
            itemValue = model.name;
            break;
          default:
            itemValue = value;
        }
        attributeValues[`:${key}`] = itemValue;
      }
    }

    // Assembly the result params
    const params = {
      TableName: this.DbConfig?.table,
      Key: {
        pk: model.pk,
        sk: model.sk,
      },
      ReturnValues:"UPDATED_NEW",
      UpdateExpression: 'set ' + updateExpressions.join(', '),
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };
    return params;
  }
  

  /**
   * 
   */
  protected get dynamoOptions() {
    const options = {
      region: this.DbConfig?.region,
      endpoint: this.DbConfig?.endpoint,
    };
    return options;
  }

  protected get DbConfig(): DatabaseConfigEnv {
    const dbConfig = this.configService.get<DatabaseConfigEnv>('database');
    return dbConfig;
  }

  
  protected abstract applyExpandParameters?(items: Array<T>, expands?: Array<string>);
  protected abstract get db(): DynamoDB.DocumentClient;
  // protected abstract serviceSortKey = '';

  constructor(
    protected configService: ConfigService,
  ) {
    
  }
}
