import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const guardPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!guardPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'authentication.permission.error.user_not_found',
      });
    }

    const userPermissionList = user?.permissions;

    const hasRequiredPermission = (userPermissionList: string[]) =>
      userPermissionList.some(
        (userPermission: string) => guardPermission === userPermission,
      );

    if (!hasRequiredPermission(userPermissionList)) {
      const getStatusCode = (type: string) => {
        const permissions = {
          access: HttpStatus.FORBIDDEN,
        };
        return permissions[type];
      };

      throw new ForbiddenException({
        statusCode: getStatusCode(guardPermission),
        message: 'authentication.permission.error.forbidden',
        properties: {
          requiredPermission: guardPermission,
          userPermissions: userPermissionList,
        },
      });
    }

    return true;
  }
}
