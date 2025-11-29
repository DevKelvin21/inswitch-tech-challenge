import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { seedUsers } from './user.seed';
import { seedProducts } from './product.seed';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const productRepository = app.get<Repository<Product>>(
    getRepositoryToken(Product),
  );

  console.log('🌱 Starting database seeding...');

  await seedUsers(userRepository);
  await seedProducts(productRepository, userRepository);

  console.log('✅ Database seeding completed!');

  await app.close();
}

runSeeds().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
