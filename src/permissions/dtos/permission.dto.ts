import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';

export class CreatePermissionDto {
  resource: Resource;
  action: Action[];
  roleName: string;
}
