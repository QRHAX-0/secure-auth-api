import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private rolePermissionService: RolePermissionService) {}

  @Get()
  async getAllRolePermission() {
    return this.rolePermissionService.getAllRolePermission();
  }

  @Delete(':roleId/:permissionId')
  async deleteRolePermission(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return await this.rolePermissionService.deleteRolePermission(
      roleId,
      permissionId,
    );
  }
}
