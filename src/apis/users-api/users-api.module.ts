import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from '@env';
import { UserApiController } from './users-api.controller';
import { UsersApiService } from './users-api.service';

@Module({
  imports: [
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
export class UsersApiModule {}
