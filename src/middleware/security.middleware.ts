import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, url, ip, headers } = req;
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // CORS headers for production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://marketsage.com');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Log security events
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = (req as any).user?.id;
    
    // Log suspicious activity
    if (this.isSuspiciousRequest(req)) {
      this.logger.warn('Suspicious request detected', {
        ip: ip || 'unknown',
        userAgent,
        url,
        method,
        userId,
        timestamp: new Date().toISOString()
      });
    }

    // Log successful requests
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      this.logger.log('Request completed', {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        ip: ip || 'unknown',
        userId,
        timestamp: new Date().toISOString()
      });
    });

    next();
  }

  private isSuspiciousRequest(req: Request): boolean {
    const { url, headers } = req;
    
    // Check for common attack patterns
    const suspiciousPatterns = [
      /\.\./,  // Directory traversal
      /<script/i,  // XSS attempts
      /union.*select/i,  // SQL injection
      /eval\(/i,  // Code injection
      /javascript:/i,  // JavaScript injection
    ];

    const userAgent = headers['user-agent'] || '';
    const suspiciousUserAgents = [
      'sqlmap',
      'nikto',
      'nmap',
      'masscan',
      'zap',
      'burp'
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url)) ||
           suspiciousUserAgents.some(ua => userAgent.toLowerCase().includes(ua));
  }
}
