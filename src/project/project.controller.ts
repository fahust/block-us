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
import { Interval } from '@nestjs/schedule';
import { GetUser } from 'src/authentication/decorator/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';

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
  ): Promise<Omit<ProjectEntity, 'password'>[]> {
    return this.projectService.search(searchTerm, limit, skip);
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
  project(@Param() { id }): Promise<Omit<ProjectEntity, 'password'>> {
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
    @GetUser() user: UserEntity,
    @Request() req,
    @Body() project: ProjectEntity,
  ): Promise<Omit<ProjectEntity, 'password'>> {
    return this.projectService.create(req.user, project);
  }
  
  @Interval(1000)
  checkTransactionIsValidate() {
    //console.log('test')
  }
  

  //faire un cron qui check si les projet poussé sur la blockchain ont leur transaction reussi, en bouclant sur ceux trouvé dans la bdd avec validation false en allant chercher sur blockchain depuis le back en get donc pas de frais
}
