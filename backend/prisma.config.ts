import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

// ─── Prisma Configuration ─────────────────────────────────────────────────────
// Prisma v7 requires connection config moved out of schema.prisma into this file

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter() {
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      return new PrismaPg(pool);
    },
  },
});
