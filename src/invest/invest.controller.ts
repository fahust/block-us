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
import { InvestService } from './invest.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvestEntity } from './invest.entity';

@ApiHeader({ name: 'authorization', description: 'Bearer ...' })
@ApiTags('Invest')
@Controller({
  path: 'invest',
  version: '1',
})
export class InvestController {
  constructor(private readonly investService: InvestService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get invest with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvestEntity,
  })
  get(@Param() { id }) {
    return this.investService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post(':projectId')
  @ApiOperation({
    summary: 'Create invest',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvestEntity,
  })
  create(@Request() req, @Body() invest: InvestEntity, @Param() { projectId }) {
    return this.investService.create(req.user, invest, projectId);
  }
}
