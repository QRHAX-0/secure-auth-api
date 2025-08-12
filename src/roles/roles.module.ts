import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
  imports: [PrismaModule],
})
export class RolesModule {}
