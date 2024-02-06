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
import { InvestService } from './invest.service';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvestEntity } from './invest.entity';
import { Interval } from '@nestjs/schedule';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Invest')
@Controller({
  path: 'invest',
  version: '1',
})
export class InvestController {
  constructor(private readonly investService: InvestService) {}

  @UseGuards(AuthGuard)
  @Get('owns')
  @ApiOperation({
    summary: 'Get my invests',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [InvestEntity],
  })
  myInvests(
    @Request() req,
    @Query() { take = 0, skip = 0 },
  ): Promise<InvestEntity[]> {
    return this.investService.myInvests(req.user.id, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get all invests from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [InvestEntity],
  })
  investsOfProject(
    @Param() { projectId },
    @Query() { take = 0, skip = 0 },
  ): Promise<InvestEntity[]> {
    return this.investService.investsOfProject(projectId, take, skip);
  }

  @UseGuards(AuthGuard)
  @Get('project/value/:projectId')
  @ApiOperation({
    summary: 'Get current value invests from a project',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Number,
  })
  investsValueOfProject(@Param() { projectId }): Promise<number> {
    return this.investService.investsValueOfProject(projectId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get invest',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvestEntity,
  })
  get(@Param() { id }): Promise<InvestEntity> {
    return this.investService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create invest',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: InvestEntity,
  })
  create(
    @Request() req,
    @Body() invest: InvestEntity,
    @Param() { projectId },
  ): Promise<InvestEntity> {
    return this.investService.create(req.user, invest, projectId);
  }

  @Interval(5000)
  checkContractIsDeployed() {
    this.investService.checkValidationTx();
  }
}
