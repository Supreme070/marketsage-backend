import { IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';

export class RegisterCompleteDto {
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  })
  password!: string;

  @IsString({ message: 'Registration ID must be a string' })
  @IsNotEmpty({ message: 'Registration ID is required' })
  registrationId!: string;
}
