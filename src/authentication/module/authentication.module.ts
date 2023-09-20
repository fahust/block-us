import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from 'src/authentication/controller/authentication.controller';
import { JwtRefreshStrategy } from 'src/authentication/guard/jwt-refresh/jwt-refresh.strategy';
// import { JwtStrategy } from 'src/authentication/guard/jwt/jwt.strategy';
import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { HelperModule } from 'src/helper/module/helper.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '600000s' },
    }),
    UserModule,
    HelperModule,
    CacheModule.register(),
    ConfigModule,
  ],
  exports: [AuthenticationService],
  providers: [
    AuthenticationService,
    // JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
