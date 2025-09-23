import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { UserSettingsController } from './user-settings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SettingsController, UserSettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
