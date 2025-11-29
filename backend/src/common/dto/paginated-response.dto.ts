import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;
}

export function createPaginatedResponseDto<T>(classRef: new () => T) {
  abstract class PaginatedResponseDto {
    @ApiProperty({ type: [classRef], description: 'Array of items' })
    data: T[];

    @ApiProperty({
      type: PaginationMetaDto,
      description: 'Pagination metadata',
    })
    meta: PaginationMetaDto;
  }

  return PaginatedResponseDto;
}
