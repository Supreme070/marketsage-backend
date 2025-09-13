import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from './dto/contact.dto';
import { Contact, ContactStatus } from '@prisma/client';
import { ApiResponse } from '../types';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto, userId: string): Promise<ApiResponse> {
    try {
      // Check if contact with email already exists
      const existingContact = await this.prisma.contact.findUnique({
        where: { email: createContactDto.email },
      });

      if (existingContact) {
        throw new ConflictException('Contact with this email already exists');
      }

      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Prepare contact data
      const contactData: any = {
        ...createContactDto,
        createdById: userId,
        organizationId: user.organizationId,
        tagsString: createContactDto.tags ? JSON.stringify(createContactDto.tags) : null,
        customFields: createContactDto.customFields ? JSON.stringify(createContactDto.customFields) : null,
      };

      // Remove tags and customFields from the data as they're handled separately
      delete contactData.tags;
      delete contactData.customFields;

      const contact = await this.prisma.contact.create({
        data: contactData,
      });

      // Transform the contact to match frontend expectations
      const transformedContact = this.transformContact(contact);

      return {
        success: true,
        data: transformedContact,
        message: 'Contact created successfully',
      };
    } catch (error) {
      this.logger.error(`Error creating contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async findAll(queryDto: ContactQueryDto, userId: string): Promise<ApiResponse> {
    try {
      const page = parseInt(queryDto.page || '1', 10);
      const limit = parseInt(queryDto.limit || '10', 10);
      const skip = (page - 1) * limit;

      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Build where clause
      const where: any = {
        organizationId: user.organizationId,
      };

      if (queryDto.search) {
        where.OR = [
          { email: { contains: queryDto.search, mode: 'insensitive' } },
          { firstName: { contains: queryDto.search, mode: 'insensitive' } },
          { lastName: { contains: queryDto.search, mode: 'insensitive' } },
          { company: { contains: queryDto.search, mode: 'insensitive' } },
        ];
      }

      if (queryDto.status) {
        where.status = queryDto.status as ContactStatus;
      }

      if (queryDto.source) {
        where.source = queryDto.source;
      }

      if (queryDto.tags) {
        where.tagsString = { contains: queryDto.tags };
      }

      // Get contacts with pagination
      const [contacts, total] = await Promise.all([
        this.prisma.contact.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.contact.count({ where }),
      ]);

      // Transform contacts
      const transformedContacts = contacts.map(contact => this.transformContact(contact));

      const result = {
        contacts: transformedContacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };

      return {
        success: true,
        data: result,
        message: 'Contacts retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async findOne(id: string, userId: string): Promise<ApiResponse> {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const contact = await this.prisma.contact.findFirst({
        where: {
          id,
          organizationId: user.organizationId,
        },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      const transformedContact = this.transformContact(contact);

      return {
        success: true,
        data: transformedContact,
        message: 'Contact retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async findByEmail(email: string, userId: string): Promise<ApiResponse> {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const contact = await this.prisma.contact.findFirst({
        where: {
          email,
          organizationId: user.organizationId,
        },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      const transformedContact = this.transformContact(contact);

      return {
        success: true,
        data: transformedContact,
        message: 'Contact retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching contact by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async update(id: string, updateContactDto: UpdateContactDto, userId: string): Promise<ApiResponse> {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if contact exists and belongs to user's organization
      const existingContact = await this.prisma.contact.findFirst({
        where: {
          id,
          organizationId: user.organizationId,
        },
      });

      if (!existingContact) {
        throw new NotFoundException('Contact not found');
      }

      // Check if email is being updated and if it conflicts
      if (updateContactDto.email && updateContactDto.email !== existingContact.email) {
        const emailConflict = await this.prisma.contact.findUnique({
          where: { email: updateContactDto.email },
        });

        if (emailConflict) {
          throw new ConflictException('Contact with this email already exists');
        }
      }

      // Prepare update data
      const updateData: any = {
        ...updateContactDto,
        tagsString: updateContactDto.tags ? JSON.stringify(updateContactDto.tags) : undefined,
        customFields: updateContactDto.customFields ? JSON.stringify(updateContactDto.customFields) : undefined,
      };

      // Remove tags and customFields from the data as they're handled separately
      delete updateData.tags;
      delete updateData.customFields;

      const contact = await this.prisma.contact.update({
        where: { id },
        data: updateData,
      });

      const transformedContact = this.transformContact(contact);

      return {
        success: true,
        data: transformedContact,
        message: 'Contact updated successfully',
      };
    } catch (error) {
      this.logger.error(`Error updating contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<ApiResponse> {
    try {
      // Get user's organization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if contact exists and belongs to user's organization
      const existingContact = await this.prisma.contact.findFirst({
        where: {
          id,
          organizationId: user.organizationId,
        },
      });

      if (!existingContact) {
        throw new NotFoundException('Contact not found');
      }

      await this.prisma.contact.delete({
        where: { id },
      });

      return {
        success: true,
        data: null,
        message: 'Contact deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private transformContact(contact: Contact): any {
    return {
      id: contact.id,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      company: contact.company,
      jobTitle: contact.jobTitle,
      location: contact.address ? `${contact.address}, ${contact.city}, ${contact.state}` : null,
      source: contact.source,
      tags: contact.tagsString ? JSON.parse(contact.tagsString) : [],
      customFields: contact.customFields ? JSON.parse(contact.customFields) : {},
      isSubscribed: contact.status === ContactStatus.ACTIVE,
      listId: null, // Will be implemented when lists are migrated
      segmentIds: [], // Will be implemented when segments are migrated
      organizationId: contact.organizationId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
