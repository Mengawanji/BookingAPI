import request from 'supertest';
import app from '../app.js';
import pool from '../config/database.js';

const timestamp = Date.now();

const testUser = {
  username: `user${timestamp}`,
  email: `user${timestamp}@example.com`,
  password: 'Password123!'
};

describe('Auth Routes', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);
  });

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.username).toBe(testUser.username);
  });

  it('should reject invalid password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
  });
});

afterAll(async () => {
  await pool.query(
    'DELETE FROM users WHERE email = $1',
    [testUser.email]
  );

  await pool.end();
});