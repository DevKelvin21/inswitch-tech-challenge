import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { QueryBuilderUtil } from '../../common/utils/query-builder.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(queryDto: UserQueryDto) {
    const {
      page = 1,
      limit = 10,
      sort,
      search,
      status,
      role,
      department,
    } = queryDto;

    let queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.department',
        'user.joinDate',
        'user.salary',
        'user.status',
        'user.createdAt',
        'user.updatedAt',
      ]);

    const filters = { status, role, department };
    queryBuilder = QueryBuilderUtil.applyFilters(queryBuilder, filters, 'user');

    if (search) {
      const searchFields = ['name', 'email', 'role', 'department'];
      queryBuilder = QueryBuilderUtil.applySearch(
        queryBuilder,
        search,
        searchFields,
        'user',
      );
    }

    queryBuilder = QueryBuilderUtil.applySorting(queryBuilder, sort, 'user');

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
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'role',
        'department',
        'joinDate',
        'salary',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    return this.findOne(savedUser.id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}
