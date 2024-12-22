const request = require('supertest');
const app = require('../app');

let server;
let token;
let accountId;

beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close(done);
});

describe('User and Authentication Setup', () => {
  it('should create a new user', async () => {
    const userData = { email: 'testuser@example.com', password: 'password123' };

    const response = await request(app)
      .post('/users')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', userData.email);
  });

  it('should authenticate the user', async () => {
    const loginData = { email: 'testuser@example.com', password: 'password123' };

    const response = await request(app)
      .post('/auth')
      .send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');

    token = response.body.token;
  });
});

describe('Accounts CRUD Operations', () => {
  it('should create a new account', async () => {
    const accountData = { name: 'Main Account', type: 'savings', balance: 1000 };

    const response = await request(app)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send(accountData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', accountData.name);

    accountId = response.body.id;
  });

  it('should fetch all accounts for the authenticated user', async () => {
    const response = await request(app)
      .get('/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch the account by ID', async () => {
    const response = await request(app)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', accountId);
    expect(response.body).toHaveProperty('name');
  });

  it('should reject access to account without token', async () => {
    const response = await request(app)
      .get(`/accounts/${accountId}`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should update the account', async () => {
    const updateData = { name: 'Updated Account', balance: 2000 };

    const response = await request(app)
      .put(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', updateData.name);
    expect(response.body).toHaveProperty('balance', updateData.balance);
  });

  it('should delete the account', async () => {
    const response = await request(app)
      .delete(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    const getResponse = await request(app)
      .get(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.statusCode).toBe(404);
    expect(getResponse.body).toHaveProperty('error', 'Account not found or access denied');
  });
});
