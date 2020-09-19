import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { Guid } from "guid-typescript";
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { BaseDynamoModel, DatabaseConfigEnv, IFindOptions } from '@core/models';
import { IExpandOptions } from '@core/models/expand-options.interface';

@Injectable()
export abstract class BaseDynamoService<T extends BaseDynamoModel> {

  /**
   * 
   * @param pk pk string
   * @param expand 
   */
  public async findByKeyAsync(sk: string, pk: string, options?: IFindOptions): Promise<T | InternalServerErrorException | NotFoundException> {
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

    if (options) {
      const resultItems = [ result as T ];
      result = ([true, false].indexOf(options.enabled) < 0) ? result : resultItems.find((x) => x.enabled === +options.enabled);

      // Expands
      if (result) {
        const expands = (options?.expand || '').split(',') || [];
        if (resultItems.length > 0 && expands.length > 0) {
          await this.applyExpandParameters(resultItems, expands);
        }
      }
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
      result = ([true, false].indexOf(options.enabled) < 0) ? result : result.filter((x) => x.enabled === +options.enabled);

      // Expands
      const expands = (options?.expand || '').split(',') || [];
      const items = result as Array<T> || [];
      if (items.length > 0 && expands.length > 0) {
        await this.applyExpandParameters(items, expands);
      }
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

    const params = this.buildUpdateItemInput(model);

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
   * @param pk 
   * @param filterValue 
   * @param oper 
   */
  protected buildExpandQueryInput(pk: string, filterValue: string, oper: string = 'BEGINS_WITH') {
    const isWord = new RegExp(/\w+/g);    
    const skConditionExpr = isWord.test(oper) ? `${oper.toLowerCase()}(#sk, :sk)` : `#sk ${oper} :sk`;

    const params = {
      "TableName": this.DbConfig?.table,
      "ScanIndexForward": false,
      "ConsistentRead": false,
      "KeyConditionExpression": `#pk = :pk And ${skConditionExpr}`,
      "ExpressionAttributeValues": {
        ":pk":  pk,
        ":sk": filterValue
      },
      "ExpressionAttributeNames": {
        "#pk": "pk",
        "#sk": "sk"
      }
    };
    return params;
  }

  /**
   * 
   * @param model 
   */
  protected buildUpdateItemInput(model: T): any {
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
   * @param models 
   * @param requestExpands 
   */
  protected async applyExpandParameters(models: Array<BaseDynamoModel>, requestExpands?: Array<string>): Promise<Array<BaseDynamoModel>> {
    for (const model of models || []) {
      for (const ec of this.expandCandidates) {
        if (requestExpands.some(x => x.toLowerCase() === ec.key)) {
          const expandModel = await this.getExpandModel(model, ec);
          model[ec.targetProperty] = expandModel;
        }
      }
    }

    return models;
  }

  /**
   * 
   * @param model 
   * @param options 
   */
  protected async getExpandModel(model: BaseDynamoModel, options: IExpandOptions) {   
    let result;
    try {
      const queryInput = this.buildExpandQueryInput(model[options.pkMapFieldName], options.skValue);
      const promise = await this.db.query(queryInput).promise();
      result = promise.Items;
    } catch (error) {
      return new InternalServerErrorException(error);
    }

    return result;
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

  /**
   * 
   */
  protected get DbConfig(): DatabaseConfigEnv {
    const dbConfig = this.configService.get<DatabaseConfigEnv>('database');
    return dbConfig;
  }

  protected abstract readonly expandCandidates: IExpandOptions[];
  /**
   * 
   */
  protected abstract get db(): DynamoDB.DocumentClient;

  /**
   * 
   * @param configService 
   */
  constructor(
    protected configService: ConfigService,
  ) {
    
  }
}
