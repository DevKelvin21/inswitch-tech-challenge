import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles('admin')
  @Get()
  @ApiOperation({
    summary:
      'Get all users with pagination, filtering, and sorting (admin only)',
  })
  @ApiOkResponse({ type: PaginatedUserResponseDto })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create new user (admin only)' })
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiOkResponse({ type: UserResponseDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
