import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CorrelationInterceptor } from './tracing/correlation.interceptor';
import { SimpleTracingService } from './tracing/simple-tracing.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js dev
      'https://*.vercel.app',   // Vercel deployments
      'https://*.railway.app',  // Railway deployments
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global correlation interceptor for tracing
  const tracingService = app.get(SimpleTracingService);
  app.useGlobalInterceptors(new CorrelationInterceptor(tracingService));

  // API prefix for versioning
  app.setGlobalPrefix('api/v2');

  // Port configuration for Railway (3006 to avoid MCP port conflicts)
  const port = configService.get<number>('PORT') || 3006;
  const host = configService.get<string>('HOST') || '0.0.0.0';

  await app.listen(port, host);
  
  logger.log(`🚀 NestJS Backend running on ${host}:${port}`);
  logger.log(`🏥 Health check: http://${host}:${port}/api/v2/health`);
  logger.log(`🔐 Auth endpoints: http://${host}:${port}/api/v2/auth`);
  logger.log(`📊 Metrics: http://${host}:${port}/api/v2/metrics`);
  logger.log(`🔍 Distributed tracing enabled with correlation IDs`);
}

bootstrap().catch(err => {
  console.error('Failed to start NestJS application:', err);
  process.exit(1);
});
