import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
// import { AllowedIpGuard } from 'src/authentication/guard/allowed-ip.guard';
import { JwtRefreshGuard } from 'src/authentication/guard/jwt-refresh/jwt-refresh.guard';
// import { JwtGuard } from 'src/authentication/guard/jwt/jwt.guard';

import { registerDecorator, ValidationOptions } from 'class-validator';

const ValidSignatureRule = (signature: string): boolean =>
    /^0x([A-Fa-f0-9]{130})$/.test(signature);

export function IsEthereumSignature(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string): any => {
        registerDecorator({
            name: 'IsEthereumSignature',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ValidSignatureRule
        });
    };
}

// export function IpGuard() {
//     return applyDecorators(UseGuards(AllowedIpGuard), ApiSecurity('ip'));
// }

// export function AuthJwtGuard() {
//     return applyDecorators(UseGuards(JwtGuard), ApiBearerAuth());
// }

export function AuthRefreshJwtGuard() {
    return applyDecorators(UseGuards(JwtRefreshGuard), ApiBearerAuth());
}
