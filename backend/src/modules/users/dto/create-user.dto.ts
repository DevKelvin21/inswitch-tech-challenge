import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsIn,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'Engineering', description: 'User department' })
  @IsString()
  department: string;

  @ApiProperty({
    example: 'active',
    description: 'User status',
    enum: ['active', 'inactive'],
  })
  @IsIn(['active', 'inactive'])
  status: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date when user joined',
  })
  @IsDateString()
  joinDate: string;

  @ApiProperty({ example: 75000, description: 'User salary' })
  @IsNumber()
  salary: number;
}
