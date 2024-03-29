import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentEntity } from './comment.entity';
import { DeleteResult } from 'typeorm';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Comment')
@Controller({
  path: 'comment',
  version: '1',
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get current comment with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentEntity,
  })
  get(@Request() req) {
    return this.commentService.get(req.comment.id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create comment',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: CommentEntity,
  })
  create(
    @Request() req,
    @Body() invest: CommentEntity,
    @Param() { projectId },
  ): Promise<CommentEntity> {
    return this.commentService.create(req.user, invest, projectId);
  }

  @UseGuards(AuthGuard)
  @Put('like/:commentId')
  @ApiOperation({
    summary: 'Like comment',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: CommentEntity,
  })
  like(@Request() req, @Param() { commentId }): Promise<CommentEntity> {
    return this.commentService.like(req.user, commentId);
  }

  @UseGuards(AuthGuard)
  @Put(':commentId')
  @ApiOperation({
    summary: 'Update comment title, content',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: CommentEntity,
  })
  update(
    @Request() req,
    @Body() comment: CommentEntity,
  ): Promise<CommentEntity> {
    return this.commentService.update(req.user, comment);
  }

  @UseGuards(AuthGuard)
  @Delete(':commentId')
  @ApiOperation({
    summary: 'Delete comment',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: DeleteResult,
  })
  delete(@Request() req, @Param() { commentId }): Promise<DeleteResult> {
    return this.commentService.delete(req.user, commentId);
  }
}
