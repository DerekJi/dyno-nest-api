export abstract class BaseDynamoModel {
  pk?: string;
  sk?: string;
  enabled = 1;
  createdOn: string;
  createdBy?: string;
  modifiedOn: string;
  modifiedBy?: string;

  abstract data?: string;
}
