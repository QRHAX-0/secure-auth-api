import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
  imports: [PrismaModule, RolesModule],
})
export class PermissionModule {}
