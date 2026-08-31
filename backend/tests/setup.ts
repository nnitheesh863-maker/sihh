// Test environment setup
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_ACCESS_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/onion_test';
process.env.AWS_ACCESS_KEY_ID = 'test_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret';
process.env.AWS_REGION = 'ap-south-1';
process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
process.env.AI_SERVICE_URL = 'http://localhost:8000';
process.env.CORS_ORIGIN = 'http://localhost:3000';
