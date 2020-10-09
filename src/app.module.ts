import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from '@env';

import { CoreModule } from '@core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { LookupValuesController } from './controllers/lookup-values.controllers';
import { LookupKindsController } from './controllers/lookup-kinds.controller';
import { LookupValuesService } from './services/lookup-values.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
    }),
    CoreModule,
  ],
  controllers: [
    AppController,
    LookupKindsController,
    LookupValuesController,
  ],
  providers: [
    AppService,
    LookupValuesService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('');
  }
}
