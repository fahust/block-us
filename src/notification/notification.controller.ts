import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationEntity } from './notification.entity';
import { UpdateResult } from 'typeorm';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Notification')
@Controller({
  path: 'notification',
  version: '1',
})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Get('owns')
  @ApiOperation({
    summary: 'Get all notifications related to current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationEntity],
  })
  myNotifications(
    @Request() req,
    @Query() { take = 0, skip = 0 },
  ): Promise<NotificationEntity[]> {
    return this.notificationService.myNotifications(req.user.id, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get one notification by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: NotificationEntity,
  })
  get(@Param() { id }): Promise<NotificationEntity> {
    return this.notificationService.get(id);
  }

  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'Change parameter "read" from all notifications related to current user',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: UpdateResult,
  })
  readNotification(@Param() { id }): Promise<UpdateResult> {
    return this.notificationService.readNotification(id);
  }
}
