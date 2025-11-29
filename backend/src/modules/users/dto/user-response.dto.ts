import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role: string;

  @ApiProperty({ example: 'Engineering', description: 'User department' })
  department: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date when user joined',
  })
  joinDate: string;

  @ApiProperty({ example: 75000, description: 'User salary' })
  salary: number;

  @ApiProperty({
    example: 'active',
    description: 'User status',
    enum: ['active', 'inactive'],
  })
  status: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
