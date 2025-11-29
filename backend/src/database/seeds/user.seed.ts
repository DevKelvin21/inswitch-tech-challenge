import { Repository } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(userRepository: Repository<User>) {
  const count = await userRepository.count();
  if (count > 0) {
    console.log('Users already seeded, skipping...');
    return;
  }

  const roles = ['Engineer', 'Manager', 'Designer', 'Analyst', 'Developer'];
  const departments = [
    'Engineering',
    'Management',
    'Design',
    'Analytics',
    'Operations',
  ];
  const statuses = ['active', 'inactive'];

  const users: Partial<User>[] = [];
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 1; i <= 50; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        1,
      ),
      salary: 50000 + Math.floor(Math.random() * 100000),
    });
  }

  await userRepository.save(users);
  console.log('✅ Seeded 50 users');
}
