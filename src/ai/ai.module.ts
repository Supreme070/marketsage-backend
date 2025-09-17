import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AITestController } from './ai-test.controller';
import { AIService } from './ai.service';
import { QueueModule } from '../queue/queue.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [QueueModule, PrismaModule],
  controllers: [AIController, AITestController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}