import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { UserBillingController } from './user-billing.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController, UserBillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
