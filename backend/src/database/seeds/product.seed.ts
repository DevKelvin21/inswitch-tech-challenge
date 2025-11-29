import { Repository } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';
import { User } from '../../modules/users/entities/user.entity';

export async function seedProducts(
  productRepository: Repository<Product>,
  userRepository: Repository<User>,
) {
  const count = await productRepository.count();
  if (count > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }

  // Get all users to assign as product owners
  const users = await userRepository.find();
  if (users.length === 0) {
    console.log('⚠️  No users found, cannot seed products with owners');
    return;
  }

  const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
  const products: Partial<Product>[] = [];

  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    // Randomly assign products to users
    const randomUser = users[Math.floor(Math.random() * users.length)];

    products.push({
      name: `Product ${i}`,
      description: `This is a great ${category} product with amazing features`,
      price: 10 + Math.floor(Math.random() * 990),
      category,
      imageUrl: `https://via.placeholder.com/200?text=Product${i}`,
      inStock: Math.random() > 0.2,
      createdById: randomUser.id,
    });
  }

  await productRepository.save(products);
  console.log('✅ Seeded 100 products with owners');
}
