import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ConfigModule } from '@nestjs/config';
import { InvestModule } from 'src/invest/invest.module';
import { HelperModule } from 'src/helper/module/helper.module';
import { VoteModule } from 'src/vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    ConfigModule,
    HelperModule,
    forwardRef(() => InvestModule),
    forwardRef(() => VoteModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
