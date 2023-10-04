import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
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

  @UseGuards(AuthGuard)
  @Get('projects')
  @ApiOperation({
    summary: 'Get projects from current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  getMyProjects(@Request() req) {
    return this.userService.getMyProjects(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('invests')
  @ApiOperation({
    summary: 'Get invests from current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  getMyInvests(@Request() req) {
    return this.userService.getMyInvests(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('votes')
  @ApiOperation({
    summary: 'Get votes from current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  getMyVotes(@Request() req) {
    return this.userService.getMyVotes(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('comments')
  @ApiOperation({
    summary: 'Get comments from current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  getMyComments(@Request() req) {
    return this.userService.getMyComments(req.user.id);
  }
}
