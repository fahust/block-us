import { Module, forwardRef } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestEntity } from './invest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestEntity])],
  controllers: [InvestController],
  providers: [InvestService],
  exports: [InvestService],
})
export class InvestModule {}
