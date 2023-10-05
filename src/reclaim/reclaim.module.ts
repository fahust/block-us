import { Module, forwardRef } from '@nestjs/common';
import { ReclaimController } from './reclaim.controller';
import { ReclaimService } from './reclaim.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReclaimEntity } from './reclaim.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from 'src/helper/module/helper.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ReclaimEntity]),
    forwardRef(() => ProjectModule),
    NotificationModule,
    HelperModule,
  ],
  controllers: [ReclaimController],
  providers: [ReclaimService],
  exports: [ReclaimService],
})
export class ReclaimModule {}
