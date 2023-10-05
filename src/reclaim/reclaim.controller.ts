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
import { ReclaimService } from './reclaim.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReclaimEntity } from './reclaim.entity';
import { Interval } from '@nestjs/schedule';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Reclaim')
@Controller({
  path: 'reclaim',
  version: '1',
})
export class ReclaimController {
  constructor(private readonly reclaimService: ReclaimService) {}

  @UseGuards(AuthGuard)
  @Get('owns')
  @ApiOperation({
    summary: 'Get my reclaimments',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ReclaimEntity],
  })
  myReclaims(
    @Request() req,
    @Query() { take = 0, skip = 0 },
  ): Promise<ReclaimEntity[]> {
    return this.reclaimService.myReclaims(req.user.id, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get all reclaimments from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ReclaimEntity],
  })
  reclaimsOfProject(
    @Param() { projectId },
    @Query() { take = 0, skip = 0 },
  ): Promise<ReclaimEntity[]> {
    return this.reclaimService.reclaimsOfProject(projectId, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get('project/value/:projectId')
  @ApiOperation({
    summary: 'Get current value reclaimments from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Number,
  })
  reclaimsValueOfProject(@Param() { projectId }): Promise<number> {
    return this.reclaimService.reclaimsValueOfProject(projectId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get one reclaimment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReclaimEntity,
  })
  get(@Param() { id }): Promise<ReclaimEntity> {
    return this.reclaimService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create an reclaimment previously sent to blockchain and wait for validation in interval',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: ReclaimEntity,
  })
  create(
    @Request() req,
    @Body() reclaim: ReclaimEntity,
    @Param() { projectId },
  ): Promise<ReclaimEntity> {
    return this.reclaimService.create(req.user, reclaim, projectId);
  }

  @Interval(5000)
  checkValidationTx() {
    this.reclaimService.checkValidationTx();
  }
}
