import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ConfigModule } from '@nestjs/config';
import { InvestModule } from 'src/invest/invest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    ConfigModule,
    forwardRef(() => InvestModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
