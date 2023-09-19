import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './project.entity';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Project')
@Controller({
  path: 'project',
  version: '1',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Get('search/:searchTerm')
  @ApiOperation({
    summary: 'Search project with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  search(@Param() { searchTerm }, @Query() { limit = 0, skip = 0 }) {
    return this.projectService.search(searchTerm, limit, skip);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get project with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  project(@Param() { id }) {
    return this.projectService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  create(@Request() req, @Body() project: ProjectEntity) {
    return this.projectService.create(req.user, project);
  }
}
