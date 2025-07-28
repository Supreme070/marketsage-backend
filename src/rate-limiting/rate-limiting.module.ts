import { Module } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}