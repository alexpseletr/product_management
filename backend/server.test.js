const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./server');

jest.mock('jsonwebtoken');

jwt.sign = jest.fn().mockReturnValue('mock-token');

test('Login with correct credentials should return a token', async () => {
    const response = await request(app).post('/login')
        .send({ username: 'user1', password: 'password1' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'mock-token');
    expect(response.body).toHaveProperty('username', 'user1');
    expect(response.body).toHaveProperty('group', 'user');
});

test('Signup with new username should create a user', async () => {
  const response = await request(app).post('/signup')
      .send({ username: 'newuser', password: 'password123' });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('message', 'User registered successfully!');
});

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ username: 'user1' })
}));

test('Get products with a valid token should return product list', async () => {
  const response = await request(app).get('/products')
      .set('Authorization', 'Bearer mock-token');
  
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('products');
  expect(response.body).toHaveProperty('group', 'user');
});

test('Update product with valid admin token should succeed', async () => {
  const response = await request(app).put('/products/1')
      .set('Authorization', 'Bearer mock-token')
      .send({ name: 'updated-iphone', price: 15 });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Product updated successfully');
  expect(products).toEqual([
      { id: 1, name: 'updated-iphone', price: 15 },
  ]);
});
