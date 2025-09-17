import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { UnifiedCampaignService } from './unified-campaign.service';
import { CampaignABTestService } from './campaign-abtest.service';
import { CampaignWorkflowService } from './campaign-workflow.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { SMSModule } from '../sms/sms.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    SMSModule,
    WhatsAppModule,
  ],
  controllers: [CampaignsController],
  providers: [
    UnifiedCampaignService,
    CampaignABTestService,
    CampaignWorkflowService,
  ],
  exports: [
    UnifiedCampaignService,
    CampaignABTestService,
    CampaignWorkflowService,
  ],
})
export class CampaignsModule {}
