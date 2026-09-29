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
  const adminPassword = await bcrypt.hash('Password123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { password: adminPassword },
    create: {
      name: 'System Admin',
      email: 'admin@gmail.com',
      phone: '9000000000',
      password: adminPassword,
      role: 'ADMIN',
      village: 'Nashik',
      district: 'Nashik',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@sih.gov.in' },
    update: { password: adminPassword },
    create: {
      name: 'System Admin',
      email: 'admin@sih.gov.in',
      phone: '9000000001',
      password: adminPassword,
      role: 'ADMIN',
      village: 'Nashik',
      district: 'Nashik',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@oniongrading.in' },
    update: { password: adminPassword },
    create: {
      name: 'System Admin',
      email: 'admin@oniongrading.in',
      phone: '9000000005',
      password: adminPassword,
      role: 'ADMIN',
      village: 'Nashik',
      district: 'Nashik',
    },
  });

  // Procurement Officer
  const officerPassword = await bcrypt.hash('Password123', 12);
  await prisma.user.upsert({
    where: { email: 'officer@sih.gov.in' },
    update: { password: officerPassword },
    create: {
      name: 'Vikram Deshmukh (APMC)',
      email: 'officer@sih.gov.in',
      phone: '9876543211',
      password: officerPassword,
      role: 'PROCUREMENT_OFFICER',
      district: 'Pune',
    },
  });

  await prisma.user.upsert({
    where: { email: 'officer@oniongrading.in' },
    update: { password: officerPassword },
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
  const farmerPassword = await bcrypt.hash('Password123', 12);
  await prisma.user.upsert({
    where: { email: 'farmer@sih.gov.in' },
    update: { password: farmerPassword },
    create: {
      name: 'Sanjay Kumar (Farmer)',
      email: 'farmer@sih.gov.in',
      phone: '9876543210',
      password: farmerPassword,
      role: 'FARMER',
      village: 'Lasalgaon',
      district: 'Nashik',
    },
  });

  await prisma.user.upsert({
    where: { email: 'farmer@example.com' },
    update: { password: farmerPassword },
    create: {
      name: 'Sanjay Kumar',
      email: 'farmer@example.com',
      phone: '9876543219',
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
