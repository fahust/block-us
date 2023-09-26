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
    summary: 'Search project with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ProjectEntity],
  })
  search(
    @Param() { searchTerm },
    @Query() { limit = 0, skip = 0 },
  ): Promise<ProjectEntity[]> {
    return this.projectService.search(searchTerm, limit, skip);
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
    @Param() { mainCategory },
    @Query() { limit = 0, skip = 0 },
  ): Promise<ProjectEntity[]> {
    return this.projectService.byCategory(mainCategory, limit, skip);
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
  isOwner(
    @Request() req,
    @Param() { id },
  ): Promise<Omit<ProjectEntity, 'password' | 'owner'>> {
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
  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  create(
    @Request() req,
    @Body() project: ProjectEntity,
  ): Promise<ProjectEntity> {
    return this.projectService.create(req.user, project);
  }
  
  @Interval(5000)
  checkContractIsDeployed() {
    this.projectService.checkContractDeployTx()
  }
  
}
