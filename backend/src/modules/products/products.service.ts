import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { QueryBuilderUtil } from '../../common/utils/query-builder.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(queryDto: ProductQueryDto) {
    const { page = 1, limit = 10, sort, search, category, inStock } = queryDto;

    let queryBuilder = this.productRepository.createQueryBuilder('product');

    const filters = { category, inStock };
    queryBuilder = QueryBuilderUtil.applyFilters(
      queryBuilder,
      filters,
      'product',
    );

    if (search) {
      const searchFields = ['name', 'description'];
      queryBuilder = QueryBuilderUtil.applySearch(
        queryBuilder,
        search,
        searchFields,
        'product',
      );
    }

    const sortParam = sort || 'createdAt:desc';
    queryBuilder = QueryBuilderUtil.applySorting(
      queryBuilder,
      sortParam,
      'product',
    );

    const total = await queryBuilder.getCount();

    queryBuilder = QueryBuilderUtil.applyPagination(queryBuilder, page, limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
