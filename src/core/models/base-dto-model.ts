export abstract class BaseDtoModel {
  key?: string;
  enabled = 1;
  createdOn: string;
  createdBy?: string;
  modifiedOn: string;
  modifiedBy?: string;
}
