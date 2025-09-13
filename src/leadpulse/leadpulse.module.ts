import { Module } from '@nestjs/common';
import { LeadPulseController } from './controllers/leadpulse.controller';
import { LeadPulseService } from './services/leadpulse.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LeadPulseController],
  providers: [LeadPulseService],
  exports: [LeadPulseService]
})
export class LeadPulseModule {}
