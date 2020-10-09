import { BaseDynamoModel } from '@core/models';
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from 'src/app.service';

// @ApiSecurity('Authorisation') // NOTE: The string must be consistent to the last parameter of the line addApiKey() in main.ts
export abstract class BaseController {

  protected abstract readonly _table: string;
  
  constructor(protected apiService: AppService) {
  }

  /**
   * GET ONE RECORD
   * @param id 
   * @param fields 
   * @param expand 
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findByKey(
    @Param('id') id: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findByKeyAsync(this._table, id, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }

  /**
   * GET ALL RECORDS
   * @param fields 
   * @param expand 
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findAllAsync(this._table, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }
  
  /**
   * CREATE
   * 
   * @param model The json-formatted object
   */
  @Post()
  async create(@Body() model: BaseDynamoModel): Promise<any> {
    model = this.beforeCreate(model);
    const result = await this.apiService.createAsync(this._table, model);
    return result;
  }

  /**
   * UPDATE
   * 
   * @param key partition key, string, which should be the key of the record
   * @param model The json-formatted object
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() model: BaseDynamoModel): Promise<any> {
    model = this.beforeUpdate(model);
    const result = await this.apiService.updateAsync(this._table, model);
    return result;
  }

  /**
   * DELETE
   * 
   * @param id partition key, string, which should be the key of the record
   * @param hard indicates soft-delete or hard-delete
   */
  @Delete(':id')
  async delete(@Param('id') id: string, @Query('hard') hardDelete?: boolean): Promise<any> {
    const result = (true === hardDelete || 'true' === (hardDelete || '').toLowerCase()) ? 
      await this.apiService.hardDeleteAsync(this._table, id) :
      await this.apiService.softDeleteAsync(this._table, id)
    ;
    return result;
  }

  //#region  Hooks
  protected beforeCreate(model: BaseDynamoModel): BaseDynamoModel {
    model.sk = model.sk || this._table;
    return model;
  }

  protected beforeUpdate(model: BaseDynamoModel): BaseDynamoModel {
    model.sk = model.sk || this._table;
    return model;
  }
}
