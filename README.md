# MarketSage Backend

Enterprise-grade NestJS backend for MarketSage - Multi-channel Marketing Automation Platform.

## 🚀 Features

- **Multi-Channel Communication**: Email, SMS, WhatsApp integration
- **AI-Powered Intelligence**: Chat, analysis, predictions via Bull queues
- **Real-time Analytics**: Visitor tracking (LeadPulse) and behavioral analysis
- **Workflow Automation**: Visual workflow builder with queue processing
- **Enterprise Security**: JWT auth, rate limiting, RBAC
- **Scalable Architecture**: Microservices-ready with Bull queues

## 🛠️ Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis/Valkey with Bull
- **Authentication**: JWT with Passport
- **Monitoring**: OpenTelemetry, Prometheus metrics
- **API**: RESTful with OpenAPI documentation

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

## 🏃‍♂️ Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## 🐳 Docker

```bash
# Build image
docker build -t marketsage-backend .

# Run container
docker run -p 3006:3006 marketsage-backend
```

## 📚 API Documentation

The API runs on port 3006 by default:

- Health Check: `http://localhost:3006/api/v2/health`
- Metrics: `http://localhost:3006/api/v2/metrics`
- API Docs: `http://localhost:3006/api/docs` (coming soon)

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/marketsage"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Server
PORT=3006
NODE_ENV=development
```

## 📁 Project Structure

```
src/
├── ai/                 # AI services with queue integration
├── auth/               # Authentication & authorization
├── campaigns/          # Campaign management (coming soon)
├── contacts/           # Contact management (coming soon)
├── health/             # Health checks
├── leadpulse/          # Visitor tracking (coming soon)
├── messaging/          # Email/SMS/WhatsApp (coming soon)
├── metrics/            # Prometheus metrics
├── notifications/      # In-app notifications
├── organizations/      # Multi-tenant organizations
├── queue/              # Bull queue processors
├── redis/              # Redis/cache services
├── tracing/            # Distributed tracing
├── users/              # User management
├── workflows/          # Workflow automation (coming soon)
└── main.ts             # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security

- JWT-based authentication
- Rate limiting on all endpoints
- Input validation with class-validator
- SQL injection protection via Prisma
- CORS configuration
- Helmet.js security headers

## 📊 Monitoring

- Prometheus metrics at `/api/v2/metrics`
- Health checks at `/api/v2/health`
- Distributed tracing with correlation IDs
- Custom business metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🔗 Links

- [Frontend Repository](https://github.com/Supreme070/marketsage)
- [Monitoring Stack](https://github.com/Supreme070/marketsage-monitoring)
- [Documentation](https://docs.marketsage.com) (coming soon)