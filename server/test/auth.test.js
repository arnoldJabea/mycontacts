jest.setTimeout(20000);

require('./setupTestDB');
const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const email = `user+${Date.now()}@mc.local`;
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Passw0rd!' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const email = `user+${Date.now()}@mc.local`;
    await request(app)
      .post('/auth/register')
      .send({ email, password: 'Passw0rd!' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'Passw0rd!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
