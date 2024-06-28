import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: './src/database/drizzle',
  schema: './src/database/drizzle/schema.ts',
  dbCredentials: {
    url: String(process.env.DATABASE_URL_DRIZZLE),
  },
  verbose: true,
  strict: true,
} satisfies Config;
