import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LgaController } from './lga/lga.controller';
import { LgaService } from './lga/lga.service';

@Module({
  imports: [],
  controllers: [AppController, LgaController],
  providers: [AppService, LgaService],
})
export class AppModule {}
