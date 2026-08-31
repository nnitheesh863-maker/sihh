import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Check', () => {
  it('GET /health returns 200 with healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register with invalid data returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad-email', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Protected Routes', () => {
  it('GET /api/onions/history without token returns 401', async () => {
    const res = await request(app).get('/api/onions/history');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/users without token returns 401', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });
});
