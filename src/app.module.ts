import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from '@env';

import { CoreModule } from '@core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
