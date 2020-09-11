import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreModule } from '@core/core.module';

import env from '@env';
import { UserApiController } from './users-api/users-api.controller';
import { UsersApiService } from './users-api/users-api.service';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      load: [env],
    }),
    
  ],
  controllers: [
    UserApiController,
  ],
  providers: [
    UsersApiService,
  ],
})
export class AppModule {}
