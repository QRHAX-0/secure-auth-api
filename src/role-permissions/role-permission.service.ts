import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolePermissionService {
  constructor(private prisma: PrismaService) {}

  async getAllRolePermission() {
    return await this.prisma.rolePermission.findMany({
      include: { role: true, permission: true },
    });
  }

  async deleteRolePermission(roleId: number, permissionId: number) {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: roleId,
          permissionId: permissionId,
        },
      },
    });
  }
}
