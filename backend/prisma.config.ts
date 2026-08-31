import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

// ─── Prisma v7 Configuration ───────────────────────────────────────────────
// Prisma v7: connection URL and adapter are configured here, NOT in schema.prisma

const connectionString = process.env.DATABASE_URL!;

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: connectionString
  },
  migrate: {
    async adapter() {
      const { Pool } = await import('pg');
      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
