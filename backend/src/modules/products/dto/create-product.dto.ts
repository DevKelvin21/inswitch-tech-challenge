import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsIn,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Pro 15', description: 'Product name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'High-performance laptop with 16GB RAM',
    description: 'Product description',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 1299.99, description: 'Product price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'electronics',
    description: 'Product category',
    enum: ['electronics', 'clothing', 'books', 'home', 'sports'],
  })
  @IsIn(['electronics', 'clothing', 'books', 'home', 'sports'])
  category: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Product image URL',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether product is in stock',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}
