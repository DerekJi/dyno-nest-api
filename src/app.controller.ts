import { BaseDynamoModel } from '@core/models';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('app')
@ApiSecurity('x-api-key') // NOTE: The string must be consistent to the last parameter of the line addApiKey() in main.ts
export class AppController {
  
  constructor(private readonly apiService: AppService) {
  }

  /**
   * GET ONE RECORD
   * @param sk 
   * @param key 
   * @param fields 
   * @param expand 
   */
  @Get(':sk/:key')
  async findByKey(
    @Param('sk') sk: string,
    @Param('key') key: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findByKeyAsync(sk, key, { fields: fields.trim(), expand: expand.trim() });
    return result;
  }

  /**
   * GET ALL RECORDS
   * @param sk 
   * @param fields 
   * @param expand 
   */
  @Get(':sk')
  async findAll(
    @Param('sk') sk: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findAllAsync(sk, { fields: fields.trim(), expand: expand.trim() });
    return result;
  }
  
  /**
   * CREATE
   * 
   * @param sk sort key, string, which should be the name of the entity
   * @param model The json-formatted object
   */
  @Post(':sk')
  async create(@Param('sk') sk: string, @Body() model: BaseDynamoModel): Promise<any> {
    const result = await this.apiService.createAsync(sk, model);
    return result;
  }

  /**
   * UPDATE
   * 
   * @param sk sort key, string, which should be the name of the entity
   * @param key partition key, string, which should be the key of the record
   * @param model The json-formatted object
   */
  @Patch(':sk/:key')
  async update(@Param('sk') sk: string, @Body() model: BaseDynamoModel): Promise<any> {
    const result = await this.apiService.updateAsync(sk, model);
    return result;
  }

  /**
   * DELETE
   * 
   * @param sk sort key, string, which should be the name of the entity
   * @param key partition key, string, which should be the key of the record
   * @param hard indicates soft-delete or hard-delete
   */
  @Delete(':sk/:key')
  async delete(@Param('sk') sk: string, @Param('key') key: string, @Query('hard') hardDelete?: boolean): Promise<any> {
    const result = (true === hardDelete || 'true' === (hardDelete || '').toLowerCase()) ? 
      await this.apiService.hardDeleteAsync(sk, key) :
      await this.apiService.softDeleteAsync(sk, key)
    ;
    return result;
  }
}
