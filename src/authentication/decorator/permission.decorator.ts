import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
// import { AuthJwtGuard } from 'src/authentication/decorator/authentication.decorator';
import { PermissionGuard } from 'src/authentication/guard/permission.guard';

export const Permission = (permission: string) => {
    return applyDecorators(
        SetMetadata('permission', permission),
        // AuthJwtGuard(),
        UseGuards(PermissionGuard)
    );
};
