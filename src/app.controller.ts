import { BaseDynamoModel } from '@core/models';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiSecurity } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * App Controller
 */
@Controller('common')
@ApiSecurity('Authorisation') // NOTE: The string must be consistent to the last parameter of the line addApiKey() in main.ts
export class AppController {
  
  constructor(
    private readonly apiService: AppService,
    protected configService: ConfigService,
  ) {
  }

  /**
   * GET ONE RECORD
   * @param table 
   * @param id 
   * @param fields 
   * @param expand 
   */
  @Get(':table/:id')
  async findByKey(
    @Param('table') table: string,
    @Param('id') id: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findByKeyAsync(table, id, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }  

  /**
   * GET ALL RECORDS
   * @param table 
   * @param fields 
   * @param expand 
   */
  @Get(':table')
  async findAll(
    @Param('table') table: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findAllAsync(table, { fields: fields?.trim(), expand: expand?.trim() });
    return result;
  }
  
  /**
   * CREATE
   * 
   * @param table sort key, string, which should be the name of the entity
   * @param model The json-formatted object
   */
  @Post(':table')
  async create(@Param('table') table: string, @Body() model: BaseDynamoModel): Promise<any> {
    model.data = model?.data || table;
    model.name = model?.name || table;
    model.sk = model?.sk  || table;
    const result = await this.apiService.createAsync(table, model);
    return result;
  }

  /**
   * UPDATE
   * 
   * @param table sort key, string, which should be the name of the entity
   * @param key partition key, string, which should be the key of the record
   * @param model The json-formatted object
   */
  @Patch(':table/:id')
  async update(@Param('table') table: string, @Param('id') id: string, @Body() model: BaseDynamoModel): Promise<any> {
    model.data = model.data || table;
    model.name = model?.name || table;
    model.sk = model?.sk || table;
    model.pk = id;
    const result = await this.apiService.updateAsync(table, model);
    return result;
  }

  /**
   * DELETE
   * 
   * @param table sort key, string, which should be the name of the entity
   * @param id partition key, string, which should be the key of the record
   * @param hard indicates soft-delete or hard-delete
   */
  @Delete(':table/:id')
  async delete(@Param('table') table: string, @Param('id') id: string, @Query('hard') hardDelete?: boolean): Promise<any> {
    const result = (true === hardDelete || 'true' === (hardDelete || '').toLowerCase()) ? 
      await this.apiService.hardDeleteAsync(table, id) :
      await this.apiService.softDeleteAsync(table, id)
    ;
    return result;
  }
}
