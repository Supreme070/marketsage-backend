import { Module } from '@nestjs/common';
import { SMSController } from './sms.controller';
import { SMSService } from './sms.service';
import { SMSProviderService } from './sms-provider.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SMSController],
  providers: [SMSService, SMSProviderService],
  exports: [SMSService, SMSProviderService],
})
export class SMSModule {}
