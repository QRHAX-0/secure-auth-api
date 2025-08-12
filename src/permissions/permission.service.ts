import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { RoleService } from 'src/roles/roles.service';

@Injectable()
export class PermissionService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
  ) {}

  async createPermission(
    resource: Resource,
    action: Action[],
    roleName: string,
  ) {
    if (!roleName) throw new Error('roleName is required');

    const checkRole = await this.roleService.getRoleByName(roleName);
    if (!checkRole) throw new Error(`Role "${roleName}" not found`);

    return this.prisma.permission.create({
      data: {
        resource,
        action,
        rolePermission: {
          create: {
            roleId: checkRole.id,
          },
        },
      },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany();
  }
}
