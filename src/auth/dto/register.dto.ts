import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'Organization name must be a string' })
  @MinLength(2, { message: 'Organization name must be at least 2 characters long' })
  organizationName?: string;

  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  website?: string;

  @IsOptional()
  @IsString({ message: 'Industry must be a string' })
  industry?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;
}