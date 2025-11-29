import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UserQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'active',
    description: 'Filter by user status',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Filter by user role',
  })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'Engineering',
    description: 'Filter by department',
  })
  @IsOptional()
  department?: string;
}
