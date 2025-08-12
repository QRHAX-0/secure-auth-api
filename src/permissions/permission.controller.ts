import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dtos/permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async getPermissions() {
    return this.permissionService.getPermissions();
  }

  @Post()
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionService.createPermission(
      dto.resource,
      dto.action,
      dto.roleName,
    );
  }
}
