import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormDto, UpdateFormDto, FormQueryDto, FormSubmissionDto, SubmissionQueryDto } from '../dto/form.dto';
import { CreateInsightDto, InsightQueryDto, GenerateInsightDto } from '../dto/insight.dto';
import { CreateVisitorDto, VisitorQueryDto, CreateTouchpointDto } from '../dto/visitor.dto';


@Injectable()
export class LeadPulseService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== FORM MANAGEMENT ====================

  async createForm(userId: string, organizationId: string, createFormDto: CreateFormDto) {
    const { fields, ...formData } = createFormDto;

    const form = await this.prisma.leadPulseForm.create({
      data: {
        ...formData,
        createdBy: userId,
        fields: fields ? {
          create: fields.map((field: any) => ({
            ...field
          }))
        } : undefined
      } as any,
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return form;
  }

  async getForms(organizationId: string, query: FormQueryDto) {
    const { search, status, isPublished, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    const [forms, total] = await Promise.all([
      this.prisma.leadPulseForm.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          fields: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              submissions: true
            }
          }
        }
      }),
      this.prisma.leadPulseForm.count({ where })
    ]);

    return {
      forms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getFormById(id: string, organizationId: string) {
    const form = await this.prisma.leadPulseForm.findUnique({
      where: { id },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        submissions: {
          take: 10,
          orderBy: { submittedAt: 'desc' },
          include: {
            visitor: {
              select: { id: true, fingerprint: true, country: true }
            }
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    return form;
  }

  async updateForm(id: string, organizationId: string, updateFormDto: UpdateFormDto) {
    const form = await this.prisma.leadPulseForm.findUnique({
      where: { id }
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    return this.prisma.leadPulseForm.update({
      where: { id },
      data: updateFormDto as any,
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async deleteForm(id: string, organizationId: string) {
    const form = await this.prisma.leadPulseForm.findUnique({
      where: { id }
    });

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    await this.prisma.leadPulseForm.delete({
      where: { id }
    });

    return { success: true };
  }

  // ==================== FORM SUBMISSIONS ====================

  async submitForm(submissionDto: FormSubmissionDto, ipAddress?: string, userAgent?: string, userId?: string) {
    const { formId, visitorId, data, context } = submissionDto;

    // Verify form exists and is published
    const form = await this.prisma.leadPulseForm.findFirst({
      where: { id: formId, isPublished: true },
      include: { fields: true }
    });

    if (!form) {
      throw new BadRequestException('Form not found or not published');
    }

    // Create or find visitor
    let visitor = null;
    if (visitorId) {
      visitor = await this.prisma.leadPulseVisitor.findUnique({
        where: { id: visitorId }
      });
    }

    // Process submission data
    const submissionData = [];
    for (const [fieldName, value] of Object.entries(data)) {
      const field = form.fields.find((f: any) => f.name === fieldName);
      if (field) {
        submissionData.push({
          fieldId: field.id,
          fieldName: field.name,
          fieldType: field.type,
          field: field.label,
          value: String(value)
        });
      }
    }

    // Create submission
    const submission = await this.prisma.leadPulseFormSubmission.create({
      data: {
        formId,
        visitorId: visitor?.id,
        ipAddress,
        userAgent,
        utmSource: context?.utmSource,
        utmMedium: context?.utmMedium,
        utmCampaign: context?.utmCampaign,
        referrer: context?.referrer,
        status: 'PROCESSED', // For now, auto-process
        processedAt: new Date(),
        score: this.calculateLeadScore(data),
        quality: this.calculateLeadQuality(data) as any,
        metadata: { context },
        data: {
          create: submissionData
        }
      },
      include: {
        form: {
          select: { id: true, name: true, title: true }
        },
        visitor: {
          select: { id: true, fingerprint: true, country: true }
        },
        data: {
          include: {
            field: {
              select: { name: true, label: true, type: true }
            }
          }
        }
      }
    });

    // Create or update contact if email provided
    let contactId = null;
    if (data.email) {
      const contact = await this.prisma.contact.upsert({
        where: { 
          email: data.email
        },
        update: {
          firstName: data.firstName || data.name?.split(' ')[0] || '',
          lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
          phone: data.phone || '',
          customFields: JSON.stringify({
            ...data,
            lastFormSubmission: formId,
            lastSubmissionDate: new Date()
          })
        },
        create: {
          email: data.email,
          firstName: data.firstName || data.name?.split(' ')[0] || '',
          lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
          phone: data.phone || '',
          createdBy: { connect: { id: userId } },
          customFields: JSON.stringify({
            ...data,
            firstFormSubmission: formId,
            firstSubmissionDate: new Date()
          })
        }
      });

      contactId = contact.id;

      // Update submission with contact ID
      await this.prisma.leadPulseFormSubmission.update({
        where: { id: submission.id },
        data: { contactId }
      });
    }

    return {
      success: true,
      submissionId: submission.id,
      status: 'PROCESSED',
      message: 'Form submitted successfully',
      lead: {
        score: submission.score,
        quality: submission.quality,
        contactId
      }
    };
  }

  async getSubmissions(organizationId: string, query: SubmissionQueryDto) {
    const { formId, visitorId, status, search, page = 1, limit = 10, sortBy = 'submittedAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (formId) {
      where.formId = formId;
    }

    if (visitorId) {
      where.visitorId = visitorId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { ipAddress: { contains: search, mode: 'insensitive' } },
        { utmSource: { contains: search, mode: 'insensitive' } },
        { utmCampaign: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [submissions, total] = await Promise.all([
      this.prisma.leadPulseFormSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          form: {
            select: { id: true, name: true, title: true }
          },
          visitor: {
            select: { id: true, fingerprint: true, country: true }
          },
          contact: {
            select: { id: true, email: true, firstName: true, lastName: true }
          },
          data: {
            include: {
              field: {
                select: { name: true, label: true, type: true }
              }
            }
          }
        }
      }),
      this.prisma.leadPulseFormSubmission.count({ where })
    ]);

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // ==================== VISITOR MANAGEMENT ====================

  async createVisitor(createVisitorDto: CreateVisitorDto) {
    return this.prisma.leadPulseVisitor.upsert({
      where: { fingerprint: createVisitorDto.fingerprint },
      update: {
        lastVisit: new Date(),
        totalVisits: { increment: 1 },
        ...createVisitorDto
      },
      create: {
        ...createVisitorDto,
        totalVisits: 1,
        firstVisit: new Date(),
        lastVisit: new Date()
      }
    });
  }

  async getVisitors(query: VisitorQueryDto) {
    const { fingerprint, country, search, page = 1, limit = 10, sortBy = 'lastVisit', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (fingerprint) {
      where.fingerprint = fingerprint;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { fingerprint: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [visitors, total] = await Promise.all([
      this.prisma.leadPulseVisitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              formSubmissions: true,
              touchpoints: true
            }
          }
        }
      }),
      this.prisma.leadPulseVisitor.count({ where })
    ]);

    return {
      visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async createTouchpoint(createTouchpointDto: CreateTouchpointDto) {
    const { visitorId, anonymousVisitorId, ...touchpointData } = createTouchpointDto;
    
    const data: any = {
      ...touchpointData
    };

    if (visitorId) {
      data.visitorId = visitorId;
    } else if (anonymousVisitorId) {
      data.anonymousVisitorId = anonymousVisitorId;
    }
    
    return this.prisma.leadPulseTouchpoint.create({
      data,
      include: {
        visitor: {
          select: { id: true, fingerprint: true, country: true }
        }
      }
    });
  }

  // ==================== INSIGHTS ====================

  async createInsight(createInsightDto: CreateInsightDto) {
    return this.prisma.leadPulseInsight.create({
      data: createInsightDto
    });
  }

  async getInsights(query: InsightQueryDto) {
    const { type, importance, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (importance) {
      where.importance = importance;
    }

    const insights = await this.prisma.leadPulseInsight.findMany({
      where,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    });

    // Calculate analytics
    const analytics = {
      totalInsights: await this.prisma.leadPulseInsight.count(),
      highPriorityCount: await this.prisma.leadPulseInsight.count({
        where: { importance: 'HIGH' }
      }),
      recentInsights: await this.prisma.leadPulseInsight.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      }),
      categoryBreakdown: {
        behavior: await this.prisma.leadPulseInsight.count({ where: { type: 'BEHAVIOR' } }),
        prediction: await this.prisma.leadPulseInsight.count({ where: { type: 'PREDICTION' } }),
        opportunity: await this.prisma.leadPulseInsight.count({ where: { type: 'OPPORTUNITY' } }),
        trend: await this.prisma.leadPulseInsight.count({ where: { type: 'TREND' } })
      }
    };

    return {
      success: true,
      insights,
      analytics
    };
  }

  async generateInsight(generateInsightDto: GenerateInsightDto) {
    const { trigger, data } = generateInsightDto;

    // Simulate AI insight generation based on trigger
    let newInsight = null;

    switch (trigger) {
      case 'visitor_spike':
        if (data?.increase && data.increase > 50) {
          newInsight = await this.createInsight({
            type: 'TREND' as any,
            title: `${data.increase}% Traffic Spike Detected`,
            description: `Unusual traffic increase detected from ${data.source || 'multiple sources'}. This could indicate viral content or campaign success.`,
            importance: data.increase > 100 ? 'HIGH' as any : 'MEDIUM' as any,
            metric: {
              label: 'Traffic Increase',
              value: data.increase,
              format: 'percentage',
              change: data.increase - 100
            },
            recommendation: 'Monitor conversion rates closely and ensure infrastructure can handle the load. Consider scaling marketing budget.'
          });
        }
        break;

      case 'conversion_drop':
        if (data?.dropPercentage && data.dropPercentage > 20) {
          newInsight = await this.createInsight({
            type: 'OPPORTUNITY' as any,
            title: `Conversion Rate Drop: ${data.dropPercentage}%`,
            description: `Conversion rate has dropped significantly in the last ${data.timeFrame || 'hour'}. Immediate investigation needed.`,
            importance: 'HIGH' as any,
            metric: {
              label: 'Conversion Drop',
              value: data.dropPercentage,
              format: 'percentage',
              change: -data.dropPercentage
            },
            recommendation: 'Check payment gateway, form functionality, and recent website changes. Consider reverting recent updates.'
          });
        }
        break;

      case 'high_engagement':
        newInsight = await this.createInsight({
          type: 'BEHAVIOR' as any,
          title: 'Exceptional Engagement Detected',
          description: `Current session shows ${data?.score || 95}% engagement score, indicating high purchase intent.`,
          importance: 'HIGH' as any,
          metric: {
            label: 'Engagement Score',
            value: data?.score || 95,
            format: 'number',
            change: (data?.score || 95) - 70
          },
          recommendation: 'Deploy personalized offers or initiate live chat to maximize conversion opportunity.'
        });
        break;
    }

    return {
      success: true,
      insight: newInsight,
      generated: !!newInsight
    };
  }

  async deleteInsight(id: string) {
    const insight = await this.prisma.leadPulseInsight.findUnique({
      where: { id }
    });

    if (!insight) {
      throw new NotFoundException('Insight not found');
    }

    await this.prisma.leadPulseInsight.delete({
      where: { id }
    });

    return { success: true, deleted: true };
  }

  // ==================== HELPER METHODS ====================

  private calculateLeadScore(data: Record<string, any>): number {
    let score = 0;

    // Email presence
    if (data.email) score += 20;

    // Phone presence
    if (data.phone) score += 15;

    // Company presence
    if (data.company) score += 10;

    // Job title presence
    if (data.jobTitle) score += 10;

    // Budget indicators
    if (data.budget) score += 15;

    // Timeline indicators
    if (data.timeline) score += 10;

    // Additional fields
    const additionalFields = Object.keys(data).length - 1; // Exclude email
    score += Math.min(additionalFields * 2, 20);

    return Math.min(score, 100);
  }

  private calculateLeadQuality(data: Record<string, any>): string {
    const score = this.calculateLeadScore(data);

    if (score >= 80) return 'HIGH';
    if (score >= 60) return 'MEDIUM';
    return 'LOW';
  }
}