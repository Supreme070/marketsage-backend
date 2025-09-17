import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { TracingModule } from './tracing/tracing.module';
import { RedisModule } from './redis/redis.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';
import { AIModule } from './ai/ai.module';
import { ContactsModule } from './contacts/contacts.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { LeadPulseModule } from './leadpulse/leadpulse.module';
import { EmailModule } from './email/email.module';
import { SMSModule } from './sms/sms.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { SecurityModule } from './security/security.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { BillingModule } from './billing/billing.module';
import { SupportModule } from './support/support.module';
import { MessagesModule } from './messages/messages.module';
import { IncidentsModule } from './incidents/incidents.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Use the local .env file
    }),
    RedisModule,
    RateLimitingModule,
    TracingModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    NotificationsModule,
    QueueModule,
    AIModule,
    ContactsModule,
    WorkflowsModule,
    LeadPulseModule,
    EmailModule,
    SMSModule,
    WhatsAppModule,
    CampaignsModule,
        DashboardModule,
        AdminModule,
        SecurityModule,
        SettingsModule,
        AuditModule,
        BillingModule,
        SupportModule,
        MessagesModule,
        IncidentsModule,
        HealthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
