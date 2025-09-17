import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateABTestDto, 
  CreateABTestVariantDto, 
  UpdateABTestDto,
  ABTestStatus,
  WinnerCriteria,
  VariantType
} from './dto/campaigns.dto';
import { EntityType, ABTestType, ABTestMetric } from '@prisma/client';

@Injectable()
export class CampaignABTestService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== A/B TEST MANAGEMENT ====================

  async createABTest(campaignId: string, data: CreateABTestDto, userId: string, organizationId: string) {
    // Verify campaign exists (check in any channel module)
    const campaign = await this.findCampaignInAnyChannel(campaignId, userId, organizationId);
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== 'DRAFT') {
      throw new BadRequestException('A/B tests can only be created for draft campaigns');
    }

    const abTest = await this.prisma.aBTest.create({
      data: {
        name: data.name || 'Untitled A/B Test',
        description: data.description,
        entityType: EntityType.EMAIL_CAMPAIGN, // Use appropriate entity type
        entityId: campaignId,
        status: 'DRAFT',
        testType: ABTestType.SIMPLE_AB, // Use existing enum
        testElements: JSON.stringify(['subject', 'content', 'sender']),
        winnerMetric: data.winnerCriteria ? this.mapWinnerCriteriaToMetric(data.winnerCriteria) : ABTestMetric.OPEN_RATE,
        winnerThreshold: data.confidenceLevel ? data.confidenceLevel / 100 : 0.95,
        distributionPercent: 1.0, // 100% of audience for testing
        createdById: userId,
      },
      include: {
        variants: true,
      },
    });

    return abTest;
  }

  async getABTests(campaignId: string, userId: string, organizationId: string) {
    // Verify campaign exists
    const campaign = await this.findCampaignInAnyChannel(campaignId, userId, organizationId);
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const abTests = await this.prisma.aBTest.findMany({
      where: { 
        entityType: EntityType.EMAIL_CAMPAIGN,
        entityId: campaignId,
        createdById: userId,
      },
      include: {
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return abTests;
  }

  async getABTestById(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
      include: {
        variants: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    return abTest;
  }

  async updateABTest(abTestId: string, data: UpdateABTestDto, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status === 'RUNNING' && data.status === 'DRAFT') {
      throw new BadRequestException('Cannot change running A/B test to draft');
    }

    const updatedABTest = await this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        winnerMetric: data.winnerCriteria ? this.mapWinnerCriteriaToMetric(data.winnerCriteria) : undefined,
        winnerThreshold: data.confidenceLevel ? data.confidenceLevel / 100 : undefined,
      },
      include: {
        variants: true,
      },
    });

    return updatedABTest;
  }

  async deleteABTest(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status === 'RUNNING') {
      throw new BadRequestException('Cannot delete running A/B test');
    }

    await this.prisma.aBTest.delete({
      where: { id: abTestId },
    });

    return { message: 'A/B test deleted successfully' };
  }

  // ==================== VARIANT MANAGEMENT ====================

  async createVariant(abTestId: string, data: CreateABTestVariantDto, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status === 'RUNNING') {
      throw new BadRequestException('Cannot add variants to running A/B test');
    }

    // Check if this is the first variant (control)
    const existingVariants = await this.prisma.aBTestVariant.count({
      where: { testId: abTestId },
    });

    if (existingVariants === 0) {
      data.isControl = true;
    }

    // Validate weight distribution
    if (data.weight) {
      const totalWeight = await this.prisma.aBTestVariant.aggregate({
        where: { testId: abTestId },
        _sum: { trafficPercent: true },
      });

      if ((totalWeight._sum.trafficPercent || 0) + data.weight > 100) {
        throw new BadRequestException('Total variant weights cannot exceed 100%');
      }
    }

    const variant = await this.prisma.aBTestVariant.create({
      data: {
        testId: abTestId,
        name: data.name || 'Untitled Variant',
        description: data.description,
        content: data.config || '{}', // Store config as content
        trafficPercent: data.weight || 50.0,
      },
    });

    return variant;
  }

  async getVariants(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    const variants = await this.prisma.aBTestVariant.findMany({
      where: { testId: abTestId },
      orderBy: { createdAt: 'asc' },
    });

    return variants;
  }

  async updateVariant(variantId: string, data: Partial<CreateABTestVariantDto>, userId: string, organizationId: string) {
    const variant = await this.prisma.aBTestVariant.findFirst({
      where: {
        id: variantId,
        test: {
          createdById: userId,
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const abTest = await this.prisma.aBTest.findUnique({
      where: { id: variant.testId },
    });

    if (abTest?.status === 'RUNNING') {
      throw new BadRequestException('Cannot update variants in running A/B test');
    }

    const updatedVariant = await this.prisma.aBTestVariant.update({
      where: { id: variantId },
      data: {
        name: data.name,
        description: data.description,
        content: data.config,
        trafficPercent: data.weight || variant.trafficPercent,
      },
    });

    return updatedVariant;
  }

  async deleteVariant(variantId: string, userId: string, organizationId: string) {
    const variant = await this.prisma.aBTestVariant.findFirst({
      where: {
        id: variantId,
        test: {
          createdById: userId,
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const abTest = await this.prisma.aBTest.findUnique({
      where: { id: variant.testId },
    });

    if (abTest?.status === 'RUNNING') {
      throw new BadRequestException('Cannot delete variants in running A/B test');
    }

    await this.prisma.aBTestVariant.delete({
      where: { id: variantId },
    });

    return { message: 'Variant deleted successfully' };
  }

  // ==================== A/B TEST EXECUTION ====================

  async startABTest(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
      include: {
        variants: true,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status !== 'DRAFT') {
      throw new BadRequestException('Only draft A/B tests can be started');
    }

    if (abTest.variants.length < 2) {
      throw new BadRequestException('A/B test must have at least 2 variants');
    }

    // Validate weight distribution
    const totalWeight = abTest.variants.reduce((sum: number, variant: any) => sum + variant.trafficPercent, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new BadRequestException('Variant weights must sum to 100%');
    }

    const updatedABTest = await this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
      },
      include: {
        variants: true,
      },
    });

    return {
      message: 'A/B test started successfully',
      abTest: updatedABTest,
    };
  }

  async pauseABTest(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status !== 'RUNNING') {
      throw new BadRequestException('Only running A/B tests can be paused');
    }

    const updatedABTest = await this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'PAUSED',
      },
    });

    return {
      message: 'A/B test paused successfully',
      abTest: updatedABTest,
    };
  }

  async completeABTest(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
      include: {
        variants: true,
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    if (abTest.status !== 'RUNNING') {
      throw new BadRequestException('Only running A/B tests can be completed');
    }

    // Calculate winner based on criteria
    const winner = await this.calculateWinner(abTest);

    const updatedABTest = await this.prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        winnerVariantId: winner?.id,
      },
    });

    return {
      message: 'A/B test completed successfully',
      abTest: updatedABTest,
      winner,
    };
  }

  // ==================== ANALYTICS ====================

  async getABTestAnalytics(abTestId: string, userId: string, organizationId: string) {
    const abTest = await this.prisma.aBTest.findFirst({
      where: {
        id: abTestId,
        createdById: userId,
      },
      include: {
        variants: true,
        results: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!abTest) {
      throw new NotFoundException('A/B test not found');
    }

    const analytics = abTest.variants.map(variant => {
      const variantResults = abTest.results.filter(r => r.variantId === variant.id);
      
      // Calculate metrics from results
      const sent = variantResults.reduce((sum: number, r: any) => sum + (r.metric === ABTestMetric.OPEN_RATE ? r.value : 0), 0);
      const delivered = variantResults.reduce((sum: number, r: any) => sum + (r.metric === ABTestMetric.CLICK_RATE ? r.value : 0), 0);
      const opened = variantResults.reduce((sum: number, r: any) => sum + (r.metric === ABTestMetric.OPEN_RATE ? r.value : 0), 0);
      const clicked = variantResults.reduce((sum: number, r: any) => sum + (r.metric === ABTestMetric.CLICK_RATE ? r.value : 0), 0);

      const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
      const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
      const clickRate = opened > 0 ? (clicked / opened) * 100 : 0;

      return {
        ...variant,
        metrics: {
          sent,
          delivered,
          opened,
          clicked,
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          openRate: Math.round(openRate * 100) / 100,
          clickRate: Math.round(clickRate * 100) / 100,
        },
      };
    });

    return {
      abTest: {
        id: abTest.id,
        name: abTest.name,
        status: abTest.status,
        winnerMetric: abTest.winnerMetric,
        winnerThreshold: abTest.winnerThreshold,
        startedAt: abTest.startedAt,
        endedAt: abTest.endedAt,
        winnerVariantId: abTest.winnerVariantId,
      },
      variants: analytics,
    };
  }

  // ==================== HELPER METHODS ====================

  private async findCampaignInAnyChannel(campaignId: string, userId: string, organizationId: string) {
    // Try to find campaign in email module
    try {
      const emailCampaign = await this.prisma.emailCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
          organizationId,
        },
      });
      if (emailCampaign) return emailCampaign;
    } catch (e) {
      // Campaign not found in email module
    }

    // Try to find campaign in SMS module
    try {
      const smsCampaign = await this.prisma.sMSCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
        },
      });
      if (smsCampaign) return smsCampaign;
    } catch (e) {
      // Campaign not found in SMS module
    }

    // Try to find campaign in WhatsApp module
    try {
      const whatsappCampaign = await this.prisma.whatsAppCampaign.findFirst({
        where: {
          id: campaignId,
          createdById: userId,
        },
      });
      if (whatsappCampaign) return whatsappCampaign;
    } catch (e) {
      // Campaign not found in WhatsApp module
    }

    return null;
  }

  private mapWinnerCriteriaToMetric(criteria: WinnerCriteria): ABTestMetric {
    switch (criteria) {
      case WinnerCriteria.HIGHEST_OPEN_RATE:
        return ABTestMetric.OPEN_RATE;
      case WinnerCriteria.HIGHEST_CLICK_RATE:
        return ABTestMetric.CLICK_RATE;
      case WinnerCriteria.HIGHEST_REPLY_RATE:
        return ABTestMetric.CONVERSION_RATE; // Map reply rate to conversion rate
      case WinnerCriteria.HIGHEST_CONVERSION_RATE:
        return ABTestMetric.CONVERSION_RATE;
      case WinnerCriteria.LOWEST_COST_PER_CONVERSION:
        return ABTestMetric.CUSTOM; // Map to custom for cost-based metrics
      case WinnerCriteria.HIGHEST_REVENUE:
        return ABTestMetric.REVENUE;
      default:
        return ABTestMetric.OPEN_RATE;
    }
  }

  private async calculateWinner(abTest: any) {
    const variants = abTest.variants;
    
    if (variants.length === 0) {
      return null;
    }

    let winner = null;
    let bestScore = -1;

    for (const variant of variants) {
      // Get results for this variant
      const results = await this.prisma.aBTestResult.findMany({
        where: { variantId: variant.id },
      });

      let score = 0;

      switch (abTest.winnerMetric) {
        case ABTestMetric.OPEN_RATE:
          const sent = results.find(r => r.metric === ABTestMetric.OPEN_RATE)?.value || 0;
          const opened = results.find(r => r.metric === ABTestMetric.OPEN_RATE)?.value || 0;
          score = sent > 0 ? (opened / sent) * 100 : 0;
          break;
        case ABTestMetric.CLICK_RATE:
          const delivered = results.find(r => r.metric === ABTestMetric.CLICK_RATE)?.value || 0;
          const clicked = results.find(r => r.metric === ABTestMetric.CLICK_RATE)?.value || 0;
          score = delivered > 0 ? (clicked / delivered) * 100 : 0;
          break;
        case ABTestMetric.CONVERSION_RATE:
          const delivered2 = results.find(r => r.metric === ABTestMetric.CONVERSION_RATE)?.value || 0;
          const replied = results.find(r => r.metric === ABTestMetric.CONVERSION_RATE)?.value || 0;
          score = delivered2 > 0 ? (replied / delivered2) * 100 : 0;
          break;
        default:
          score = 0;
      }

      if (score > bestScore) {
        bestScore = score;
        winner = {
          ...variant,
          score,
        };
      }
    }

    return winner;
  }
}