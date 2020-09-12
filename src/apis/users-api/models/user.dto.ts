import { BaseDtoModel } from "@core/models";
import { ApiProperty } from "@nestjs/swagger";

import { UserApiOptions } from './user-api-options';

export class UserDto extends BaseDtoModel {
  @ApiProperty(UserApiOptions.get('name'))
  name?: string;

  @ApiProperty(UserApiOptions.get('email'))
  email?: string;

  @ApiProperty(UserApiOptions.get('role'))
  role?: string;
}

export class UpdateUserDto extends UserDto {
  @ApiProperty({ required: true })
  key?: string;
}