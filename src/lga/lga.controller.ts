import { Controller, Get, Param } from '@nestjs/common';
import { LgaService } from './lga.service';

@Controller('api/v1/lgas')
export class LgaController {
  constructor(private readonly lgaService: LgaService) {}

  @Get(':key')
  getLga(@Param('key') key: string): string {
    const result = [ key ];
    return JSON.stringify(result);
  }
}
