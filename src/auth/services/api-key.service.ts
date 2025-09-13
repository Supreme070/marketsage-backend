import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApiKeyDto, UpdateApiKeyDto } from '../dto/api-key.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(organizationId: string, createApiKeyDto: CreateApiKeyDto) {
    // Generate a secure API key
    const key = this.generateApiKey();
    
    // Check if key already exists (very unlikely but good practice)
    const existingKey = await this.prisma.apiKey.findUnique({
      where: { key }
    });
    
    if (existingKey) {
      throw new ConflictException('API key collision detected. Please try again.');
    }

    return this.prisma.apiKey.create({
      data: {
        key,
        name: createApiKeyDto.name,
        description: createApiKeyDto.description,
        expiresAt: createApiKeyDto.expiresAt,
        organizationId
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async getApiKeys(organizationId: string) {
    return this.prisma.apiKey.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true
        // Note: We don't return the actual key for security
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getApiKeyById(organizationId: string, apiKeyId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { 
        id: apiKeyId,
        organizationId 
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    return apiKey;
  }

  async updateApiKey(organizationId: string, apiKeyId: string, updateApiKeyDto: UpdateApiKeyDto) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { 
        id: apiKeyId,
        organizationId 
      }
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        name: updateApiKeyDto.name,
        description: updateApiKeyDto.description,
        isActive: updateApiKeyDto.isActive,
        expiresAt: updateApiKeyDto.expiresAt
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deleteApiKey(organizationId: string, apiKeyId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { 
        id: apiKeyId,
        organizationId 
      }
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.delete({
      where: { id: apiKeyId }
    });

    return { message: 'API key deleted successfully' };
  }

  async updateLastUsed(apiKeyId: string) {
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() }
    });
  }

  private generateApiKey(): string {
    // Generate a secure random API key
    // Format: ms_<32 random hex characters>
    const randomBytes = crypto.randomBytes(16);
    return `ms_${randomBytes.toString('hex')}`;
  }
}
