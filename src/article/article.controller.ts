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
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { DeleteResult } from 'typeorm';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Article')
@Controller({
  path: 'article',
  version: '1',
})
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Get(':projectId')
  @ApiOperation({
    summary: 'Get one article with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleEntity,
  })
  get(@Request() req, @Param() { articleId }) {
    return this.articleService.get(req.user, articleId);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create article',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ArticleEntity,
  })
  create(
    @Body() article: ArticleEntity,
    @Param() { projectId },
  ): Promise<ArticleEntity> {
    return this.articleService.create(article, projectId);
  }

  @UseGuards(AuthGuard)
  @Put('like/:articleId')
  @ApiOperation({
    summary: 'Like article',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ArticleEntity,
  })
  like(@Request() req, @Param() { articleId }): Promise<ArticleEntity> {
    return this.articleService.like(req.user, articleId);
  }

  @UseGuards(AuthGuard)
  @Put(':articleId')
  @ApiOperation({
    summary: 'Update article title, content, image, visible',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ArticleEntity,
  })
  update(
    @Request() req,
    @Body() article: ArticleEntity,
  ): Promise<ArticleEntity> {
    return this.articleService.update(req.user, article);
  }

  @UseGuards(AuthGuard)
  @Delete(':articleId')
  @ApiOperation({
    summary: 'Delete article',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: DeleteResult,
  })
  delete(@Request() req, @Param() { articleId }): Promise<DeleteResult> {
    return this.articleService.delete(req.user, articleId);
  }
}
