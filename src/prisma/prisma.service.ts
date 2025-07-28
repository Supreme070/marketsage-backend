import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to connect to database: ${err.message}`);
      throw error;
    }
  }

  async enableShutdownHooks(app: any) {
    // Simplified shutdown hook
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}