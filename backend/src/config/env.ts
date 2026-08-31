import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  env: getEnv('NODE_ENV', 'development'),
  port: parseInt(getEnv('PORT', '5000'), 10),
  apiVersion: getEnv('API_VERSION', 'v1'),

  database: {
    url: getEnv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/onion_grading'),
  },

  jwt: {
    accessSecret: getEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_in_prod'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_in_prod'),
    accessExpiresIn: getEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  aws: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID', 'mock_key'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', 'mock_secret'),
    region: getEnv('AWS_REGION', 'ap-south-1'),
    s3BucketName: getEnv('AWS_S3_BUCKET_NAME', 'onion-grading-images'),
  },

  supabase: {
    url: getEnv('SUPABASE_URL', 'https://mock.supabase.co'),
    anonKey: getEnv('SUPABASE_ANON_KEY', 'mock_supabase_key'),
  },

  ai: {
    serviceUrl: getEnv('AI_SERVICE_URL', 'http://localhost:8000'),
    timeout: parseInt(getEnv('AI_SERVICE_TIMEOUT', '30000'), 10),
  },

  rateLimit: {
    windowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  },

  cors: {
    origin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
  },

  logging: {
    level: getEnv('LOG_LEVEL', 'debug'),
    dir: getEnv('LOG_DIR', 'logs'),
  },

  isDev: () => config.env === 'development',
  isProd: () => config.env === 'production',
};
