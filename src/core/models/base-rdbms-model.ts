import { ApiProperty } from "@nestjs/swagger";

export class BaseRdbmsModel {
  @ApiProperty({ required: false, example: '', description: 'The primary key of the record.' })
  id?: number;

  @ApiProperty({ required: false, default: true, example: true, description: 'Indicates if the record is active or not' })
  enabled = true;
  [key: string]: any;

  constructor(partial: Partial<BaseRdbmsModel>) {
    Object.assign(this, partial);
  }
}
