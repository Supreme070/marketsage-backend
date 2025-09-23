import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserMessagesController } from './user-messages.controller';
import { QueueModule } from '../queue/queue.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [QueueModule, PrismaModule],
  controllers: [MessagesController, UserMessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
