import {
  Body,
  Controller,
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

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Article')
@Controller({
  path: 'article',
  version: '1',
})
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get current article with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleEntity,
  })
  get(@Request() req) {
    return this.articleService.get(req.article.id);
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
}
