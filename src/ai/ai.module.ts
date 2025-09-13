import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AITestController } from './ai-test.controller';
import { AIService } from './ai.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [AIController, AITestController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}