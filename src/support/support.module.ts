import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { UserSupportController } from './user-support.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupportController, UserSupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
