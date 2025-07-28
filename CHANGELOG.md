# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial NestJS backend setup with TypeScript
- JWT authentication with Passport
- Multi-tenant organization support
- User management with role-based access control (RBAC)
- Redis/Valkey integration for caching and sessions
- Bull queue system for background job processing
- AI module with chat, analysis, prediction, and content generation endpoints
- Queue processors for AI, Email, SMS, and Notification tasks
- Health checks with database and Redis monitoring
- Prometheus metrics endpoint
- Distributed tracing with correlation IDs
- Rate limiting with role-based configurations
- Notification system with in-app notifications
- Comprehensive error handling and logging
- Docker support for containerization
- GitHub Actions CI/CD pipelines

### Security
- JWT-based authentication
- Rate limiting on all endpoints
- Input validation with class-validator
- SQL injection protection via Prisma ORM
- CORS configuration
- Environment variable validation

## [0.0.1] - 2025-07-28

### Added
- Initial project structure
- Basic NestJS setup
- Prisma ORM configuration
- Docker development environment