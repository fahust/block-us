import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInPresenter } from './auth.presenter';
import { UserEntity } from 'src/user/user.entity';
import { SignInDto, SignUpDto } from './auth.dto';

@ApiTags('Autentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login with userName and password and return access JWT',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInPresenter,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe an user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  signUp(@Body() signInDto: SignUpDto) {
    return this.authService.signUp(signInDto);
  }

  @ApiHeader({ name: 'authorization', description: 'Bearer ...' })
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get current profile user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInPresenter,
  })
  getProfile(@Request() req): Promise<UserEntity> {
    return req.user;
  }
}
