import { Module, forwardRef } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestEntity } from './invest.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from 'src/helper/module/helper.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([InvestEntity]),
    forwardRef(() => ProjectModule),
    NotificationModule,
    HelperModule,
  ],
  controllers: [InvestController],
  providers: [InvestService],
  exports: [InvestService],
})
export class InvestModule {}
