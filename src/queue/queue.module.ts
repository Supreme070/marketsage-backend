import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { AITaskProcessor } from './processors/ai-task.processor';
import { EmailTaskProcessor } from './processors/email-task.processor';
import { SMSTaskProcessor } from './processors/sms-task.processor';
import { NotificationTaskProcessor } from './processors/notification-task.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'ai-tasks' },
      { name: 'email-tasks' },
      { name: 'sms-tasks' },
      { name: 'notification-tasks' },
    ),
  ],
  providers: [
    QueueService,
    AITaskProcessor,
    EmailTaskProcessor,
    SMSTaskProcessor,
    NotificationTaskProcessor,
  ],
  exports: [QueueService, BullModule],
})
export class QueueModule {}