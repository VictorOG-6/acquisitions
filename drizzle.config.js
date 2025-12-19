import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

// Load .env.development if it exists and NODE_ENV is development
if (process.env.NODE_ENV === 'development') {
  loadEnv({ path: resolve(process.cwd(), '.env.development'), override: true });
}

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
  verbose: true,
  strict: true
};