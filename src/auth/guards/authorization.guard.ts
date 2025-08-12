import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/decorators/permission.decorator';
import { Permissions } from 'src/roles/dtos/role.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class authorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user.sub) throw new UnauthorizedException('User Id not found');

    const routePermissions = this.reflector.getAllAndOverride<Permissions[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(
      ` the route permissions are ${JSON.stringify(routePermissions)}`,
    );

    try {
      const userPermissions = await this.authService.getUserPermission(
        request.user.sub,
      );

      for (const routePermission of routePermissions) {
        const userPerm = userPermissions?.find(
          (perm) => perm.permission.resource == routePermission.resource,
        );
        if (!userPerm) throw new ForbiddenException();

        const allActionsAvailable = routePermission.actions.every(
          (requiredAction) =>
            userPerm?.permission.action.includes(requiredAction),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch (e) {
      throw new ForbiddenException();
    }
    return true;
  }
}
