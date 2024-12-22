const request = require('supertest');
const app = require('../app');
const { seedUsers, seedAccounts, USER_CREDENTIALS } = require('./aux/seed');

let server;
let users;
let accounts;
let token;
let accountId;

beforeAll(async () => {
  server = app.listen(3000);
  users = await seedUsers();
  accounts = seedAccounts();

  token = (await request(app)
    .post('/auth')
    .send(USER_CREDENTIALS))
    .body.token;
});

afterAll((done) => {
  server.close(done);
});

describe('POST /accounts', () => {
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
});

describe('GET /accounts', () => {
  it('should fetch all accounts for the authenticated user', async () => {
    const response = await request(app)
      .get('/accounts')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /accounts/:id', () => {
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
});

describe('PUT /accounts/:id', () => {
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

  it('should reject access to account without token', async () => {
    const updateData = { name: 'Updated Account', balance: 2000 };
    const response = await request(app)
      .put(`/accounts/${accountId}`)
      .send(updateData);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('DELETE /accounts/:id', () => {
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

  it('should reject access to account without token', async () => {
    const response = await request(app)
      .delete(`/accounts/${accountId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});
