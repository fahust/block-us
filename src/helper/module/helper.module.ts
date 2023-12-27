import { Global, Module } from '@nestjs/common';
import { HelperDateService } from '../service/helper.date.service';
import { HelperHashService } from '../service/helper.hash.service';
import { HelperService } from '../service/helper.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  providers: [HelperService, HelperDateService, HelperHashService],
  exports: [HelperService, HelperDateService, HelperHashService],
  controllers: [],
  imports: [ConfigModule],
})
export class HelperModule {}
