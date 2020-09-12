import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseDtoModel {
  @ApiProperty({ required: false, example: '', description: 'The id of the record. Technically it is the pk in dynamodb and in the format of GUID' })
  key?: string;

  @ApiProperty({ required: false, default: true, example: true, description: 'Indicates if the record is active or not' })
  enabled?: boolean = true;

  @ApiProperty({ required: false, default: 'the current date', example: new Date().toISOString(), description: 'The date (ISOString) when the record was created' })
  createdOn?: string;

  @ApiProperty({ required: false, example: '', description: 'The user who created the record' })
  createdBy?: string;

  @ApiProperty({ required: false, default: 'the current date', example: new Date().toISOString(), description: 'The last date (ISOString) when the record was modified' })
  modifiedOn?: string;

  @ApiProperty({ required: false, example: '', description: 'The user who modified the record' })
  modifiedBy?: string;
}
