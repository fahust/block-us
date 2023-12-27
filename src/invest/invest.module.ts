import { Module, forwardRef } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestEntity } from './invest.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([InvestEntity]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [InvestController],
  providers: [InvestService],
  exports: [InvestService],
})
export class InvestModule {}
