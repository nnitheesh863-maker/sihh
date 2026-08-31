import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Setup Prisma with adapter for v7
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/onion_grading',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@oniongrading.in' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@oniongrading.in',
      phone: '9000000001',
      password: adminPassword,
      role: 'ADMIN',
      village: 'Nashik',
      district: 'Nashik',
    },
  });

  // Procurement Officer
  const officerPassword = await bcrypt.hash('Officer@123', 12);
  const officer = await prisma.user.upsert({
    where: { email: 'officer@oniongrading.in' },
    update: {},
    create: {
      name: 'Raj Patil',
      email: 'officer@oniongrading.in',
      phone: '9000000002',
      password: officerPassword,
      role: 'PROCUREMENT_OFFICER',
      district: 'Pune',
    },
  });

  // Demo Farmer
  const farmerPassword = await bcrypt.hash('Farmer@123', 12);
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@example.com' },
    update: {},
    create: {
      name: 'Sanjay Kumar',
      email: 'farmer@example.com',
      phone: '9876543210',
      password: farmerPassword,
      role: 'FARMER',
      village: 'Lasalgaon',
      district: 'Nashik',
    },
  });

  // Procurement Centers
  await prisma.procurementCenter.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Lasalgaon APMC', district: 'Nashik', latitude: 20.1148, longitude: 74.0483 },
      { name: 'Pune Market Yard', district: 'Pune', latitude: 18.5204, longitude: 73.8567 },
      { name: 'Solapur Onion Market', district: 'Solapur', latitude: 17.6868, longitude: 75.9064 },
      { name: 'Aurangabad APMC', district: 'Aurangabad', latitude: 19.8762, longitude: 75.3433 },
      { name: 'Ahmednagar Market', district: 'Ahmednagar', latitude: 19.0952, longitude: 74.7496 },
    ],
  });

  console.log('✅ Seed complete!');
  console.log(`   Admin:   admin@oniongrading.in  / Admin@123`);
  console.log(`   Officer: officer@oniongrading.in / Officer@123`);
  console.log(`   Farmer:  farmer@example.com      / Farmer@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
    prisma.$disconnect();
  });
