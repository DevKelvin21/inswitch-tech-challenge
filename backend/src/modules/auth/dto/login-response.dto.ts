import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({ type: AuthUserDto, description: 'Authenticated user data' })
  user: AuthUserDto;
}
