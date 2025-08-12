import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}
