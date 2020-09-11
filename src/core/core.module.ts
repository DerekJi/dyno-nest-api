import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from '@env';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
    }),
  ],
  providers: []
})
export class CoreModule {}
