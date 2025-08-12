import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(name: string) {
    return this.prisma.role.create({
      data: {
        name: name,
      },
    });
  }

  async getAllRoles() {
    return this.prisma.role.findMany();
  }

  async getRoleByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
      include: {
        rolePermission: {
          select: {
            permission: {
              select: {
                resource: true,
                action: true,
              },
            },
          },
        },
      },
    });
  }

  async getRoleById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermission: {
          select: { permission: true },
        },
      },
    });
  }

  async deleteRole(id: number) {
    const user = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException();
    return this.prisma.role.delete({ where: { id } });
  }
}
