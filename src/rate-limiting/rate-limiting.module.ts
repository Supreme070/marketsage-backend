import { Module, Global } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { RedisModule } from '../redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}