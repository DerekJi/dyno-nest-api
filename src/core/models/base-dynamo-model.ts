import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from 'class-transformer';

export abstract class BaseDynamoModel {
  @ApiProperty({ required: false, example: '', description: 'The key of the record. Technically it is the pk in dynamodb and in the format of GUID' })
  pk?: string;

  @ApiProperty({ required: false, example: '', description: 'The sort key of the record. It should be a combination of the app name and the entity name (in ERD)' })
  sk?: string;

  @ApiProperty({ required: false, example: '', description: 'The name of the record.' })
  name?: string;

  @ApiProperty({ required: false, default: true, example: true, description: 'Indicates if the record is active or not' })
  enabled = true;

  // @ApiProperty({ required: false, default: 'the current date', example: new Date().toISOString(), description: 'The date (ISOString) when the record was created' })
  createdOn: string;

  // @ApiProperty({ required: false, example: '', description: 'The user who created the record' })
  createdBy?: string;

  // @ApiProperty({ required: false, default: 'the current date', example: new Date().toISOString(), description: 'The last date (ISOString) when the record was modified' })
  modifiedOn: string;

  // @ApiProperty({ required: false, example: '', description: 'The user who modified the record' })
  modifiedBy?: string;

  @Exclude()
  abstract data?: string;
  [key: string]: any;

  constructor(partial: Partial<BaseDynamoModel>) {
    Object.assign(this, partial);
  }
}
