import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './project.entity';
import { Interval, Timeout } from '@nestjs/schedule';

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
    summary:
      'Search project by term in description, short description, and title, with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ProjectEntity],
  })
  search(
    @Request() req,
    @Param() { searchTerm },
    @Query() { take = 0, skip = 0 },
  ): Promise<ProjectEntity[]> {
    return this.projectService.search(searchTerm, req.user.id, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get('category/:mainCategory')
  @ApiOperation({
    summary: 'Get all projects by category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ProjectEntity],
  })
  byCategory(
    @Request() req,
    @Param() { mainCategory },
    @Query() { take = 0, skip = 0 },
  ): Promise<ProjectEntity[]> {
    return this.projectService.byCategory(
      mainCategory,
      req.user.id,
      take,
      skip,
    );
  }

  @UseGuards(AuthGuard)
  @Get('is-owner/:id')
  @ApiOperation({
    summary: 'Get user is owner of project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  isOwner(@Request() req, @Param() { id }): Promise<ProjectEntity> {
    return this.projectService.isOwner(req.user.id, id);
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
  project(@Param() { id }): Promise<ProjectEntity> {
    return this.projectService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ProjectEntity,
  })
  create(
    @Request() req,
    @Body() project: ProjectEntity,
  ): Promise<ProjectEntity> {
    return this.projectService.create(req.user, project);
  }

  @UseGuards(AuthGuard)
  @Put('like/:projectId')
  @ApiOperation({
    summary: 'Like or dislike project',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ProjectEntity,
  })
  like(@Request() req, @Param() { projectId }): Promise<ProjectEntity> {
    return this.projectService.like(req.user, projectId);
  }

  @UseGuards(AuthGuard)
  @Put(':projectId')
  @ApiOperation({
    summary: 'Update project title, content',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ProjectEntity,
  })
  update(
    @Request() req,
    @Body() project: ProjectEntity,
  ): Promise<ProjectEntity> {
    return this.projectService.update(req.user, project);
  }

  @Interval(5000)
  checkContractIsDeployed() {
    this.projectService.checkContractDeployTx();
  }
}
