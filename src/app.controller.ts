import { BaseDynamoModel, IFindOptions } from '@core/models';
import { Body, Controller, Get, Optional, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  
  constructor(private readonly apiService: AppService) {
  }

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

  @Get(':sk')
  async findAll(
    @Param('sk') sk: string,
    @Query('fields') fields?: string,
    @Query('expand') expand?: string,
  ): Promise<any> {
    const result = await this.apiService.findAllAsync(sk, { fields: fields.trim(), expand: expand.trim() });
    return result;
  }
  
  @Post(':sk')
  async create(@Param('sk') sk: string, @Body() model: BaseDynamoModel): Promise<any> {
    const result = await this.apiService.createAsync(sk, model);
    return result;

    return model;
  }

  @Patch(':sk/:key')
  async update(@Param('sk') sk: string, @Param('key') key: string, @Body() model: BaseDynamoModel): Promise<any> {
    const result = await this.apiService.updateAsync(sk, model);
    return result;

    return {};
  }
}
