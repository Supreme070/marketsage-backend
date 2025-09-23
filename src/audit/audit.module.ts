import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { UserAuditController } from './user-audit.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuditController, UserAuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
