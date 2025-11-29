import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';

export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponseDto], description: 'Array of products' })
  data: ProductResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: PaginationMetaDto;
}
