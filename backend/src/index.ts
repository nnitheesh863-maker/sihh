import { createApp } from './app';
import { connectDatabase } from './config/database';

// Initialize database connection
connectDatabase();

const app = createApp();

export default app;
