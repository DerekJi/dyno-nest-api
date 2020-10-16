import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { BaseRdbmsModel, IFindOptions, PostgresConfigEnv } from '@core/models';
import { IExpandOptions } from '@core/models/expand-options.interface';
import { Client as PostgresClient } from 'ts-postgres';
import { table } from 'console';
import { ResultRow } from 'ts-postgres/dist/src/result';

require('dotenv').config();

@Injectable()
export class BaseRdbmsService<T extends BaseRdbmsModel> {

  /**
   * 
   * @param id id number
   * @param expand 
   */
  public async findByKeyAsync(tableName: string, id: number, options?: IFindOptions): Promise<T | InternalServerErrorException | NotFoundException> {

    await this.db.connect();

    let result;
    try {
      result = await this.db.query(
        `SELECT * FROM ${tableName} WHERE id = ${id}`
      );
    } catch (error) {
      return new InternalServerErrorException(error);
    } finally {

      if (!result) {
        return new NotFoundException('Not Found');
      }

      await this.db.end();
      return result;
    }
  }

  /**
   * 
   * @param options extra optional conditions
   */
  public async findAllAsync(tableName: string, options?: IFindOptions): Promise<T[] | InternalServerErrorException | NotFoundException> {
    await this.db.connect();

    let result = [];
    try {
      const query = `SELECT * FROM ${tableName}`;
      const resultIterator = await this.db.query(query);
      for await (const row of resultIterator ) {
        const rowItem = this.convertToObject(row);
        result.push(rowItem);
      }
    } catch (error) {
      console.log(error);
      
      return new InternalServerErrorException(error);
    } finally {

      if (!result) {
        return new NotFoundException('Not Found');
      }

      await this.db.end();

      return result;
    }
  }

  /**
   * Create a new record
   * 
   * @param model the item to be created
   */
  public async createAsync(tableName: string, model: T): Promise<T | InternalServerErrorException | NotFoundException> {
    // const now = new Date().toISOString();

    // model.id = model.id || (tableName + '#' + Guid.create().toString());
    // model.tableName = tableName;
    // (model as any).id = model.id;
    // model.data = model.name;
    // model.createdOn = now;

    // const params = {
    //   TableName: this.DbConfig?.table,
    //   Item: model,
    // };

    let result;
    // try {
    //   await this.db.put(params).promise();
    //   result = Object.assign({}, model);
    // } catch (error) {
    //   return new InternalServerErrorException(error);
    // }

    return result;
  }


  /**
   * Update an existing record
   * 
   * @param model the item to be updated
   */
  public async updateAsync(tableName: string, model: T): Promise<T | InternalServerErrorException | NotFoundException> {
    // const now = new Date().toISOString();
    // model.tableName = model?.tableName || tableName;
    // model.modifiedOn = model.modifiedOn || now;

    // // console.log(model);
    
    // const params = this.buildUpdateItemInput(model);
    // // console.log(params);    

    // if (!params) {
    //   return new InternalServerErrorException('Invalid input');
    // }

    let result;
    // try {
    //   const promise = await this.db.update(params).promise();
    //   result = promise;
    // } catch (error) {
    //   return new InternalServerErrorException(error);
    // }

    return result;
  }

  /**
   * Soft delete (set enabled = false)
   * @param tableName sort key, string, which should be the name of the entity
   * @param id partition key, string, which should be the key of the record
   */
  public async softDeleteAsync(tableName: string, id: number): Promise<T | InternalServerErrorException | NotFoundException> {
    // const model: T = await this.findByKeyAsync(tableName, id) as T;
    
    // console.log(model);
    // if (model && model.id === id) {
    //   model.enabled = false;
    //   return await this.updateAsync(tableName, model);
    // }

    // else
    throw new InternalServerErrorException(`Cannot find the record with key '${id}'`);
  }

  /**
   * 
   * @param tableName sort key, string, which should be the name of the entity
   * @param id partition key, string, which should be the key of the record
   */
  public async hardDeleteAsync(tableName: string, id: number) {
    // const params = {
    //   TableName: this.DbConfig?.table,
    //   Key: {
    //     "id": id,
    //     "tableName": tableName,
    //   },
    //   ConditionExpression: "#id = :id And #tableName = :tableName",
    //   ExpressionAttributeNames: { "#id": "id", "#tableName": "tableName" },
    //   ExpressionAttributeValues: { ":id": id, ":tableName": tableName },
    // };

    let result;
    // try {
    //   await this.db.delete(params).promise();
    // } catch (error) {
    //   return new InternalServerErrorException(error);
    // }

    return result;
  }

  /**
   * 
   * @param id 
   * @param filterValue 
   * @param oper 
   */
  protected buildExpandQueryInput(id: number, filterValue: string, oper = 'BEGINS_WITH') {
  //   const isWord = new RegExp(/\w+/g);    
  //   const skConditionExpr = isWord.test(oper) ? `${oper.toLowerCase()}(#tableName, :tableName)` : `#tableName ${oper} :tableName`;

  //   const params = {
  //     "TableName": this.DbConfig?.table,
  //     "ScanIndexForward": false,
  //     "ConsistentRead": false,
  //     "KeyConditionExpression": `#id = :id And ${skConditionExpr}`,
  //     "ExpressionAttributeValues": {
  //       ":id":  id,
  //       ":tableName": filterValue
  //     },
  //     "ExpressionAttributeNames": {
  //       "#id": "id",
  //       "#tableName": "tableName"
  //     }
  //   };
  //   return params;
  // }

  // /**
  //  * 
  //  * @param model 
  //  */
  // protected buildUpdateItemInput(model: T): any {
  //   if (!model || !model.id || !model.tableName) {
  //     return null;
  //   }

  //   const updateExpressions: string[] = [];
  //   const attributeNames: any = {};
  //   const attributeValues: any = {};
  //   for (const [key, value] of Object.entries(model)) {
  //     const skipKeys = ['id', 'tableName', 'createdOn', 'createdBy', 'modifiedBy'];
  //     if (skipKeys.indexOf(key) < 0) {
  //       const updateExpr = `#${key} = :${key}`;
  //       updateExpressions.push(updateExpr);
  //       attributeNames[`#${key}`] = key;

  //       let itemValue = value;
  //       switch (key) {
  //         case 'modifiedOn':
  //           itemValue = new Date().toISOString();
  //           break;
  //         case 'data':
  //           itemValue = model.name;
  //           break;
  //         default:
  //           itemValue = value;
  //       }
  //       attributeValues[`:${key}`] = itemValue;
  //     }
  //   }

  //   // Assembly the result params
  //   const params = {
  //     TableName: this.DbConfig?.table,
  //     Key: {
  //       id: model.id,
  //       tableName: model.tableName,
  //     },
  //     ReturnValues:"UPDATED_NEW",
  //     UpdateExpression: 'set ' + updateExpressions.join(', '),
  //     ExpressionAttributeNames: attributeNames,
  //     ExpressionAttributeValues: attributeValues,
  //   };
  //   return params;
  }
  
  /**
   * 
   * @param models 
   * @param requestExpands 
   */
  protected async applyExpandParameters(models: Array<BaseRdbmsModel>, requestExpands?: Array<string>): Promise<Array<BaseRdbmsModel>> {
    // for (const model of models || []) {
    //   for (const ec of this.expandCandidates) {
    //     if (requestExpands.some(x => x.toLowerCase() === ec.key)) {
    //       const expandModel = await this.getExpandModel(model, ec);
    //       model[ec.targetProperty] = expandModel;
    //     }
    //   }
    // }

    return models;
  }

  /**
   * 
   * @param model 
   * @param options 
   */
  protected async getExpandModel(model: BaseRdbmsModel, options: IExpandOptions) {   
    let result;
    // try {
    //   const queryInput = this.buildExpandQueryInput(model[options.pkMapFieldName], options.skValue);
    //   const promise = await this.db.query(queryInput).promise();
    //   result = promise.Items as Array<any> || [];
    // } catch (error) {
    //   return new InternalServerErrorException(error);
    // }

    return options?.mode === 'array' ? result : 
            (result.length > 0 ? result[0] : null);
  }

  /**
 * Convert a string to 'Title Case'
 * @param s the string to be converted
 */
private toTitleCaseKey(s: string): string {
  const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];

  return s
    .replace(/_|-/g, ' ')
    .replace(/\w\S*/g, function(txt, index) {
      return lowers.some(x => x.toLowerCase() === txt.toLowerCase()) || index < 1 ? txt.toLowerCase() :
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
    .replace(/ /g, '')
    ;
}

/**
 * 
 * @param row ResultRow
 */
private convertToObject(row: ResultRow<any>): object {
  let obj = {};
  if (row && row.data && row.names && row.data.length === row.names.length) {
    row.names.forEach(name => {
      const key = this.toTitleCaseKey(name);
      obj[key] = row.get(name);
    });
  }
  return obj;
}

  /**
   * 
   */
  protected get DbConfig(): PostgresConfigEnv {
    const dbConfig: PostgresConfigEnv = {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    }
    return dbConfig;
  }

  protected readonly expandCandidates: IExpandOptions[] = [];
  /**
   * 
   */
  protected db: PostgresClient = new PostgresClient(this.DbConfig as any);

  /**
   * 
   * @param configService 
   */
  constructor(
    protected configService: ConfigService,
  ) {
    
  }
}
