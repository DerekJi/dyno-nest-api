import { BaseRdbmsModel } from '@core/models';
import { BaseRdbmsService } from '@core/services/base-rdbms/base-rdbms.service';
import { Body, ClassSerializerInterceptor, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';

// @ApiSecurity('Authorisation') // NOTE: The string must be consistent to the last parameter of the line addApiKey() in main.ts
export abstract class BaseRdbmsController {

  constructor(protected service: BaseRdbmsService<BaseRdbmsModel>) {
  }

  /**
   * GET ONE RECORD
   * @param id 
   * @param fields 
   * @param expand 
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':table/:id')
  async findByKey(
    @Param('table') table: string,
    @Param('id') id: number,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.service.findByKeyAsync(table, id, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }

  /**
   * GET ALL RECORDS
   * @param fields 
   * @param expand 
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':table')
  async findAll(
    @Param('table') table: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.service.findAllAsync(table, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }
  
  /**
   * CREATE
   * 
   * @param model The json-formatted object
   */
  @Post(':table')
  async create(@Param('table') table: string, @Body() model: BaseRdbmsModel): Promise<any> {
    model = this.beforeCreate(table, model);
    const result = await this.service.createAsync(table, model);
    return result;
  }

  /**
   * UPDATE
   * 
   * @param key partition key, string, which should be the key of the record
   * @param model The json-formatted object
   */
  @Patch(':table/:id')
  async update(@Param('table') table: string, @Param('id') id: number, @Body() model: BaseRdbmsModel): Promise<any> {
    model = this.beforeUpdate(table, model);
    const result = await this.service.updateAsync(table, model);
    return result;
  }

  /**
   * DELETE
   * 
   * @param id partition key, string, which should be the key of the record
   * @param hard indicates soft-delete or hard-delete
   */
  @Delete(':table/:id')
  async delete(@Param('table') table: string, @Param('id') id: number, @Query('hard') hardDelete?: boolean): Promise<any> {
    const result = (true === hardDelete || 'true' === (hardDelete || '').toLowerCase()) ? 
      await this.service.hardDeleteAsync(table, id) :
      await this.service.softDeleteAsync(table, id)
    ;
    return result;
  }

  //#region  Hooks
  protected beforeCreate(table: string, model: BaseRdbmsModel): BaseRdbmsModel {
    model.sk = model.sk || table;
    return model;
  }

  protected beforeUpdate(table: string, model: BaseRdbmsModel): BaseRdbmsModel {
    model.sk = model.sk || table;
    return model;
  }
}
