import { IsOptional, IsIn, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'electronics',
    description: 'Filter by product category',
    enum: ['electronics', 'clothing', 'books', 'home', 'sports'],
  })
  @IsOptional()
  @IsIn(['electronics', 'clothing', 'books', 'home', 'sports'])
  category?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by stock availability',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;
}
