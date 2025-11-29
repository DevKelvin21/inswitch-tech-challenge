import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'Array of users' })
  data: UserResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: PaginationMetaDto;
}
