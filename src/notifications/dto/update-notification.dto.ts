import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}

export class MarkAsReadDto {
  @IsBoolean()
  read!: boolean;
}