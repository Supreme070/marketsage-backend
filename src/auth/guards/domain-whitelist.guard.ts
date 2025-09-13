import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class DomainWhitelistGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin;
    const referer = request.headers.referer;
    
    // Extract domain from origin or referer
    const domain = this.extractDomain(origin || referer);
    
    if (!domain) {
      throw new UnauthorizedException('Valid domain origin is required');
    }

    // Get organization from request (set by ApiKeyGuard)
    const organization = request.organization;
    if (!organization) {
      throw new UnauthorizedException('Organization context required');
    }

    // Check if domain is whitelisted for this organization
    const isWhitelisted = await this.isDomainWhitelisted(domain, organization.id);
    
    if (!isWhitelisted) {
      throw new UnauthorizedException(`Domain '${domain}' is not whitelisted for this organization`);
    }

    return true;
  }

  private extractDomain(url: string): string | null {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return null;
    }
  }

  private async isDomainWhitelisted(domain: string, organizationId: string): Promise<boolean> {
    // For now, we'll implement a simple whitelist check
    // In production, this would check against a database table
    
    // Allow localhost for development
    if (domain === 'localhost' || domain === '127.0.0.1') {
      return true;
    }

    // Allow common development domains
    const devDomains = ['localhost', '127.0.0.1', '*.ngrok.io', '*.vercel.app'];
    for (const devDomain of devDomains) {
      if (devDomain.startsWith('*')) {
        const pattern = devDomain.substring(1);
        if (domain.endsWith(pattern)) {
          return true;
        }
      } else if (domain === devDomain) {
        return true;
      }
    }

    // TODO: Implement database check for organization-specific domain whitelist
    // This would query a domains table linked to organizations
    
    return false;
  }
}
