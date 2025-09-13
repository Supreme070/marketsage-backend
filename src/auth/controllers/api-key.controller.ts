import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiKeyService } from '../services/api-key.service';
import { CreateApiKeyDto, UpdateApiKeyDto } from '../dto/api-key.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    organizationId: string;
  };
}

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post()
  async createApiKey(@Request() req: AuthenticatedRequest, @Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.createApiKey(req.user.organizationId, createApiKeyDto);
  }

  @Get()
  async getApiKeys(@Request() req: AuthenticatedRequest) {
    return this.apiKeyService.getApiKeys(req.user.organizationId);
  }

  @Get(':id')
  async getApiKeyById(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.apiKeyService.getApiKeyById(req.user.organizationId, id);
  }

  @Patch(':id')
  async updateApiKey(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto
  ) {
    return this.apiKeyService.updateApiKey(req.user.organizationId, id, updateApiKeyDto);
  }

  @Delete(':id')
  async deleteApiKey(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.apiKeyService.deleteApiKey(req.user.organizationId, id);
  }
}
