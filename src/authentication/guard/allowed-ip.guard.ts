import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AllowedIpGuard implements CanActivate {
    private readonly allowedIps: string[];

    constructor(
        private readonly configService: ConfigService
    ) {
        this.allowedIps = this.configService.get<string[]>(
            'authentication.allowedIps'
        );
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;

        const isAuthorized =
            this.allowedIps.includes('*') || this.allowedIps.includes(ip);

        if (!isAuthorized) {
            throw new UnauthorizedException({
              statusCode: HttpStatus.UNAUTHORIZED,
              message: 'http.clientError.unauthorizedWithMessage',
            });
        }

        return isAuthorized;
    }
}
