import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
  @Get('')
  @ApiOperation({
    summary: 'Get current invest with all join',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: InvestEntity,
  })
  get(@Request() req) {
    return this.investService.get(req.invest.id);
  }
}
