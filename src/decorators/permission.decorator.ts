import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/roles/dtos/role.dto';

export const PERMISSIONS_KEY = 'permissions';

export const Permission = (permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
