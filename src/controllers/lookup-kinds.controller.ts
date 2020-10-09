import { BaseDynamoModel } from '@core/models';
import { BaseController } from '@core/models/base.controller';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';

const controller = 'LookupKinds';

@Controller(controller)
@ApiTags(controller)
export class LookupKindsController extends BaseController {
    protected beforeCreate(model: BaseDynamoModel): BaseDynamoModel {
        model.sk = model.sk || this._table;
        model.name = model.name || model.code;
        return model;
    }

    protected beforeUpdate(model: BaseDynamoModel): BaseDynamoModel {
        return this.beforeCreate(model);
    }

    constructor(protected apiService: AppService) {
        super(apiService);
    }
    
    protected readonly _table = controller;
}
