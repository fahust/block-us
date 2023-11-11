import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentEntity } from './comment.entity';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Comment')
@Controller({
  path: 'comment',
  version: '1',
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Get('detail')
  @ApiOperation({
    summary: 'Get current comment with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentEntity,
  })
  commentDetail(@Request() req) {
    return this.commentService.detail(req.comment.id);
  }
}
