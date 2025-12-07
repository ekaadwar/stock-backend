// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

// Adapter untuk MySQL/MariaDB sesuai Prisma 7
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

// Satu instance PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@example.com';

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.admin.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email,
        birthDate: new Date('1990-01-01'),
        gender: 'MALE',
        password: hashedPassword,
      },
    });

    console.log('Admin seeded:', email, '/ password123');
  } else {
    console.log('Admin already exists, skip seeding');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
