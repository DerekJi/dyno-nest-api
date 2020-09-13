import { BaseDynamoModel } from '@core/models';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  
  constructor(private readonly apiService: AppService) {
  }

  @Get(':sk/:key')
  async findByKey(@Param('sk') sk: string, @Param('key') key: string): Promise<any> {
    const result = await this.apiService.findByKeyAsync(sk, key);
    return result;
  }

  @Get(':sk')
  async findAll(@Param('sk') sk: string): Promise<any> {
    const result = await this.apiService.findAllAsync(sk);
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
