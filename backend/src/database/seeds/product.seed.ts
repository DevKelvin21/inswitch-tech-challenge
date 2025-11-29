import { Repository } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';

export async function seedProducts(productRepository: Repository<Product>) {
  const count = await productRepository.count();
  if (count > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }

  const categories = ['electronics', 'clothing', 'books', 'home', 'sports'];
  const products: Partial<Product>[] = [];

  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      name: `Product ${i}`,
      description: `This is a great ${category} product with amazing features`,
      price: 10 + Math.floor(Math.random() * 990),
      category,
      imageUrl: `https://via.placeholder.com/200?text=Product${i}`,
      inStock: Math.random() > 0.2,
    });
  }

  await productRepository.save(products);
  console.log('✅ Seeded 100 products');
}
