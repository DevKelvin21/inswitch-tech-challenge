import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({ example: 'Laptop Pro 15', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'High-performance laptop with 16GB RAM',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 1299.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({ example: true, description: 'Whether product is in stock' })
  inStock: boolean;

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
