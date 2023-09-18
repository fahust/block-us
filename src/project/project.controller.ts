import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
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
  @Get('detail')
  @ApiOperation({
    summary: 'Get current project with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectEntity,
  })
  projectDetail(@Request() req) {
    return this.projectService.detail(req.project.id);
  }
}
