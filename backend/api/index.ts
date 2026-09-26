import { createApp } from '../src/app';
import { connectDatabase } from '../src/config/database';

let isConnected = false;
const app = createApp();

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (err) {
      console.error('Database connection initialization failed:', err);
    }
  }
  return app(req, res);
}
