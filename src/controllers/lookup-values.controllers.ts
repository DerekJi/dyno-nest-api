import { BaseDynamoModel } from '@core/models';
import { BaseController } from '@core/models/base.controller';
import { ClassSerializerInterceptor, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LookupValuesService } from 'src/services/lookup-values.service';
import { AppService } from '../app.service';

const controller = 'LookupValues';

@Controller(controller)
@ApiTags(controller)
export class LookupValuesController extends BaseController {
    protected beforeCreate(model: BaseDynamoModel): BaseDynamoModel {
        model.sk = model.sk || this._table;
        model.name = model.name || model.code;
        return model;
    }

    protected beforeUpdate(model: BaseDynamoModel): BaseDynamoModel {
        return this.beforeCreate(model);
    }

    @Get('kind/:kind')
    /**
     * GET ALL RECORDS
     * @param fields 
     * @param expand 
     */
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAllByKind(
        @Param('kind') kind: string,
        @Query('fields') fields?: string,
        @Query('expand') expand?: string,
    ): Promise<any> {
        const result = await this.apiService.findAllByKindAsync(kind, { fields: fields.trim(), expand: expand.trim() });
        return result;
    }
    
    constructor(protected apiService: LookupValuesService) {
        super(apiService);
    }

    protected readonly _table = controller;
}
