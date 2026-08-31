import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { logger } from '../utils/logger';

// ─── Singleton Prisma Client with pg Adapter (Prisma v7) ──────────────────────

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({
      adapter,
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    } as ConstructorParameters<typeof PrismaClient>[0]);

    (prisma as any).$on('warn', (e: unknown) => {
      logger.warn('Prisma warn:', e);
    });

    (prisma as any).$on('error', (e: unknown) => {
      logger.error('Prisma error:', e);
    });
  }
  return prisma;
};

export const connectDatabase = async (): Promise<void> => {
  const client = getPrismaClient();
  await client.$connect();
  logger.info('✅ Database connected successfully');
};

export const disconnectDatabase = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
};

export { prisma };
