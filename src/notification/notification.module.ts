import { Module, forwardRef } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from 'src/helper/module/helper.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NotificationEntity]),
    forwardRef(() => ProjectModule),
    HelperModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
