import { BaseDtoModel } from "@core/models";
import { UserDynamoModel } from "../../apis/users-api/models/user-dynamo-model";
import { UserDto } from "../../apis/users-api/models/user.dto";

export function parseDyanmoModle<T extends BaseDtoModel>(dto: T): any {
  if (!dto) { return null; }

  const dtoMap = new Map(Object.entries(dto));
  dtoMap.set('pk', dtoMap.get('key'));
  dtoMap.set('sk', 'USER');

  dtoMap.delete('key');

  const model = Array.from(dtoMap).reduce((obj, [key, value]) => (
    Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
  ), {});

  return model;
}