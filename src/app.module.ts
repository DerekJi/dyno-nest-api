import { Module } from '@nestjs/common';

import { CoreModule } from '@core/core.module';
import { UsersApiModule } from './apis/users-api/users-api.module';

@Module({
  imports: [
    CoreModule,
    UsersApiModule,    
  ],  
})
export class AppModule {}
