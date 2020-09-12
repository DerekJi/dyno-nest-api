import { BaseDynamoModel } from "@core/models";

export class UserDynamoModel extends BaseDynamoModel {
  name?: string;
  email?: string;
  role?: string;

  data?: any;
}
