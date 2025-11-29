import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.createdBy', 'user')
      .select(['product', 'user.id', 'user.name', 'user.email']);

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
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdBy'],
      select: {
        createdBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = this.productRepository.create({
      ...createProductDto,
      createdById: userId,
    });
    return this.productRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
    userRole: string,
  ) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Only owner or admin can update
    if (product.createdById !== userId && userRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, userId: number, userRole: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Only owner or admin can delete
    if (product.createdById !== userId && userRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    await this.productRepository.remove(product);
  }
}
