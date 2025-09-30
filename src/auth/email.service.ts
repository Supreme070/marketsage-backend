import { Injectable, Logger } from '@nestjs/common';
import { AwsSesService } from './aws-ses.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly awsSesService: AwsSesService) {}

  async sendVerificationEmail(email: string, name: string, pin: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Sending verification email to ${email}`);
      
      // Use AWS SES service for sending emails
      const result = await this.awsSesService.sendVerificationEmail(email, name, pin);
      
      if (result) {
        this.logger.log(`✅ Verification email sent successfully to ${email}`);
      } else {
        this.logger.error(`❌ Failed to send verification email to ${email}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Sending welcome email to ${email}`);
      
      // Use AWS SES service for sending emails
      const result = await this.awsSesService.sendWelcomeEmail(email, name);
      
      if (result) {
        this.logger.log(`✅ Welcome email sent successfully to ${email}`);
      } else {
        this.logger.error(`❌ Failed to send welcome email to ${email}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      return false;
    }
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      this.logger.log('🧪 Testing email service connection...');
      const result = await this.awsSesService.testConnection();
      
      if (result) {
        this.logger.log('✅ Email service connection test successful');
      } else {
        this.logger.error('❌ Email service connection test failed');
      }
      
      return result;
    } catch (error) {
      this.logger.error('Email service connection test failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      this.logger.log(`📧 Sending password reset email to ${email}`);
      
      // Use AWS SES service for sending emails
      const result = await this.awsSesService.sendPasswordResetEmail(email, resetToken);
      
      if (result) {
        this.logger.log(`✅ Password reset email sent successfully to ${email}`);
      } else {
        this.logger.error(`❌ Failed to send password reset email to ${email}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      return false;
    }
  }
}
