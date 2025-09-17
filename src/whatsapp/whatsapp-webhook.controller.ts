import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp/webhook')
export class WhatsAppWebhookController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post(':organizationId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('organizationId') organizationId: string,
    @Body() event: any,
  ) {
    return this.whatsappService.handleWebhookEvent(event, organizationId);
  }

  @Get('verify')
  async verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ) {
    // This endpoint is used by Meta to verify the webhook
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'whatsapp_verify_token';
    if (mode === 'subscribe' && verifyToken === expectedToken) {
      return challenge;
    }
    return { error: 'Webhook verification failed' };
  }
}
