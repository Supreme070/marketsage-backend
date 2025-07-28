import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RateLimitingModule } from '../rate-limiting/rate-limiting.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RateLimitingModule, AuthModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}