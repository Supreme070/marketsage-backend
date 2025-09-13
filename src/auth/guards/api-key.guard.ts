import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Validate API key in database
    const validKey = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { organization: true }
    });

    if (!validKey || !validKey.isActive) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    // Add organization info to request for use in controllers
    request.organization = validKey.organization;
    request.apiKey = validKey;

    return true;
  }

  private extractApiKey(request: any): string | null {
    // Check Authorization header: "Bearer <api-key>"
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKeyHeader = request.headers['x-api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return null;
  }
}
