// import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtGuard extends AuthGuard('jwt') {
//   constructor() {
//     super();
//   }

//   handleRequest<TUser = any>(
//     err: Record<string, any>,
//     user: TUser,
//     info: any,
//   ): TUser {
//     if (!user && !err && !info) {
//       throw new UnauthorizedException({
//         statusCode: HttpStatus.UNAUTHORIZED,
//         message: 'http.clientError.unauthorizedWithMessage',
//         properties: {
//           message: 'User not found',
//         },
//       });
//     }

//     if (err || !user) {
//       throw new UnauthorizedException({
//         statusCode: HttpStatus.UNAUTHORIZED,
//         message: 'http.clientError.unauthorizedWithMessage',
//         properties: {
//           message: info.message,
//         },
//       });
//     }

//     return user;
//   }
// }
