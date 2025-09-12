/**
 * Production Security Configuration
 * ================================
 * Comprehensive security settings for production deployment
 */

export const SecurityConfig = {
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    ALGORITHM: 'HS256',
  },

  // Password Security
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
    SALT_ROUNDS: 12,
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },

  // Rate Limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    },
    API_REQUESTS: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 60 * 1000, // 1 minute
    },
    REGISTRATION: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
    },
  },

  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://marketsage.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    CREDENTIALS: true,
  },

  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // Session Security
  SESSION: {
    SECURE: process.env.NODE_ENV === 'production',
    HTTP_ONLY: true,
    SAME_SITE: 'strict',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Database Security
  DATABASE: {
    CONNECTION_LIMIT: 10,
    QUERY_TIMEOUT: 30000, // 30 seconds
    ENCRYPTION_KEY: process.env.DATABASE_ENCRYPTION_KEY,
  },

  // Redis Security
  REDIS: {
    PASSWORD: process.env.REDIS_PASSWORD,
    TLS: process.env.NODE_ENV === 'production',
    KEY_PREFIX: 'marketsage:',
  },

  // Email Security
  EMAIL: {
    VERIFICATION_EXPIRES_IN: 24 * 60 * 60 * 1000, // 24 hours
    MAX_EMAILS_PER_HOUR: 100,
    SPAM_THRESHOLD: 0.8,
  },

  // File Upload Security
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    SCAN_FOR_VIRUSES: process.env.NODE_ENV === 'production',
  },

  // API Security
  API: {
    VERSION: 'v2',
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    CIRCUIT_BREAKER_THRESHOLD: 5,
  },

  // Monitoring & Logging
  MONITORING: {
    LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    LOG_RETENTION_DAYS: 90,
    ALERT_THRESHOLD: 100, // Failed requests per minute
    METRICS_INTERVAL: 60000, // 1 minute
  },

  // Backup & Recovery
  BACKUP: {
    FREQUENCY: 'daily',
    RETENTION_DAYS: 30,
    ENCRYPTION: true,
    STORAGE_LOCATION: process.env.BACKUP_STORAGE_URL,
  },
};

  // Environment-specific overrides
  if (process.env.NODE_ENV === 'production') {
    SecurityConfig.JWT.SECRET = process.env.JWT_SECRET || 'production-secret-not-set';
    SecurityConfig.SESSION.SECURE = true;
    SecurityConfig.CORS.ALLOWED_ORIGINS = [process.env.FRONTEND_URL || 'https://marketsage.com'];
  }

export default SecurityConfig;
