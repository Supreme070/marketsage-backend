import { IsString, Length, IsNotEmpty } from 'class-validator';

export class RegisterVerifyDto {
  @IsString({ message: 'PIN must be a string' })
  @Length(6, 6, { message: 'PIN must be exactly 6 digits' })
  @IsNotEmpty({ message: 'PIN is required' })
  pin!: string;

  @IsString({ message: 'Registration ID must be a string' })
  @IsNotEmpty({ message: 'Registration ID is required' })
  registrationId!: string;
}
