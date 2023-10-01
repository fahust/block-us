import { Module, forwardRef } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from './vote.entity';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from 'src/helper/module/helper.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([VoteEntity]),
    forwardRef(() => ProjectModule),
    NotificationModule,
    HelperModule,
  ],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
