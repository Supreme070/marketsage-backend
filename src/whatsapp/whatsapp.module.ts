import { Module } from '@nestjs/common';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppWebhookController } from './whatsapp-webhook.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppProviderService } from './whatsapp-provider.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsAppController, WhatsAppWebhookController],
  providers: [WhatsAppService, WhatsAppProviderService],
  exports: [WhatsAppService, WhatsAppProviderService],
})
export class WhatsAppModule {}