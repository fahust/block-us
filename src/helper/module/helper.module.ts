import { Global, Module } from '@nestjs/common';
import { HelperDateService } from '../service/helper.date.service';
import { HelperHashService } from '../service/helper.hash.service';
import { HelperService } from '../service/helper.service';
import { ConfigModule } from '@nestjs/config';
import { HelperBlockchainService } from '../service/helper.blockchain.service';

@Global()
@Module({
  providers: [
    HelperService,
    HelperDateService,
    HelperHashService,
    HelperBlockchainService,
  ],
  exports: [
    HelperService,
    HelperDateService,
    HelperHashService,
    HelperBlockchainService,
  ],
  controllers: [],
  imports: [ConfigModule],
})
export class HelperModule {}
