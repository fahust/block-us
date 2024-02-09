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
import { VoteService } from './vote.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VoteEntity } from './vote.entity';
import { Interval } from '@nestjs/schedule';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Vote')
@Controller({
  path: 'vote',
  version: '1',
})
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AuthGuard)
  @Get('owns')
  @ApiOperation({
    summary: 'Get my votes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [VoteEntity],
  })
  myVotes(@Request() req): Promise<Omit<VoteEntity, 'owner'>[]> {
    return this.voteService.myVotes(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get all votes from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [VoteEntity],
  })
  votesOfProject(
    @Param() { projectId },
  ): Promise<Omit<VoteEntity, 'owner' | 'project'>[]> {
    return this.voteService.votesOfProject(projectId);
  }

  @UseGuards(AuthGuard)
  @Get('project/value/:projectId')
  @ApiOperation({
    summary: 'Get current value votes from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Number,
  })
  votesValueOfProject(@Param() { projectId }): Promise<number> {
    return this.voteService.votesValueOfProject(projectId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get vote',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VoteEntity,
  })
  get(@Param() { id }): Promise<VoteEntity> {
    return this.voteService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create vote previously sent to blockchain and wait for validation in interval',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: VoteEntity,
  })
  create(
    @Request() req,
    @Body() vote: VoteEntity,
    @Param() { projectId },
  ): Promise<VoteEntity> {
    return this.voteService.create(req.user, vote, projectId);
  }

  @Interval(5000)
  checkValidationTx() {
    this.voteService.checkValidationTx()
  }
}
