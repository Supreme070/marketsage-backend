// Local types for NestJS backend
// These will be kept in sync with the shared types in the frontend

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  IT_ADMIN = 'IT_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  AI_AGENT = 'AI_AGENT',
}

export enum OrganizationPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    organizationId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    organizationId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken?: string;
}