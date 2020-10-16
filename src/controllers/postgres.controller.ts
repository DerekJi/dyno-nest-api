import { BaseRdbmsModel } from '@core/models';
import { BaseRdbmsController } from '@core/models/base-rdbms.controller';
import { BaseRdbmsService } from '@core/services/base-rdbms/base-rdbms.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';

const controller = 'Postgres';

@Controller(controller)
@ApiTags(controller)
export class PostgresController extends BaseRdbmsController {

    constructor(protected service: BaseRdbmsService<BaseRdbmsModel>) {
        super(service);
    }
    
    protected readonly _table = controller;
}
