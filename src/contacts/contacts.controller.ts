import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto, @Request() req: AuthenticatedRequest) {
    return this.contactsService.create(createContactDto, req.user.id);
  }

  @Get()
  async findAll(@Query() queryDto: ContactQueryDto, @Request() req: AuthenticatedRequest) {
    return this.contactsService.findAll(queryDto, req.user.id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string, @Request() req: AuthenticatedRequest) {
    return this.contactsService.findByEmail(email, req.user.id);
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportContacts(@Query() query: any, @Request() req: AuthenticatedRequest) {
    return this.contactsService.exportContacts(query, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.contactsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.contactsService.update(id, updateContactDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.contactsService.remove(id, req.user.id);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async importContacts(@Body() data: any, @Request() req: AuthenticatedRequest) {
    return this.contactsService.importContacts(data, req.user.id);
  }
}
