import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PermissionController } from './permissions/permission.controller';
import { PermissionService } from './permissions/permission.service';
import { PermissionModule } from './permissions/permission.module';
import { RolePermissionController } from './role-permissions/role-permission.controller';
import { RolePermissionModule } from './role-permissions/role-permission.module';
import { RolePermissionService } from './role-permissions/role-permission.service';
import { RoleService } from './roles/roles.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RolesModule,
    PermissionModule,
    RolePermissionModule,
  ],
  controllers: [
    AuthController,
    RoleController,
    PermissionController,
    RolePermissionController,
  ],
  providers: [
    AuthService,
    PermissionService,
    RolePermissionService,
    RoleService,
  ],
})
export class AppModule {}
