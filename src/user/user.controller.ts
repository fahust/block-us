import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenTreasurePresenter } from './user.presenter';
import { UserEntity } from './user.entity';
import { OpenTreasureDto } from './user.dto';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('')
  @ApiOperation({
    summary: 'Get current user with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  get(@Request() req) {
    return this.userService.getMyAccount(req.user.id);
  }
}
