import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsEntity } from './news.entity';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('News')
@Controller({
  path: 'news',
  version: '1',
})
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get current news with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: NewsEntity,
  })
  get(@Request() req) {
    return this.newsService.get(req.news.id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create article',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: NewsEntity,
  })
  create(
    @Body() article: NewsEntity,
    @Param() { projectId },
  ): Promise<NewsEntity> {
    return this.newsService.create(article, projectId);
  }
}
