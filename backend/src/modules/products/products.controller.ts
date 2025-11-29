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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination, filtering, and sorting',
  })
  @ApiOkResponse({ type: PaginatedProductResponseDto })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create new product (admin only)' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update product (admin only)' })
  @ApiOkResponse({ type: ProductResponseDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (admin only)' })
  @ApiOkResponse({ description: 'Product successfully deleted' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
