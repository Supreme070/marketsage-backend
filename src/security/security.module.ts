import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { UserSecurityController } from './user-security.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityController, UserSecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
