const request = require('supertest');
const app = require('../app');

let server;
let token;
let accountId;
let transactionId;

beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const userData = { email: 'testuser@example.com', password: 'password123' };

    const response = await request(app)
      .post('/users')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', userData.email);
  });
});

describe('POST /auth', () => {
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

describe('POST /transactions', () => {
  it('should create a new transaction', async () => {
    const transactionData = { accountId, amount: 100, type: 'deposit' };

    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(transactionData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('accountId', accountId);

    transactionId = response.body.id;
  });

  it('should reject access to account without token', async () => {
    const transactionData = { accountId, amount: 100, type: 'deposit' };

    const response = await request(app)
      .post('/transactions')
      .send(transactionData);

    expect(response.statusCode).toBe(403);
  });
});

describe('GET /transactions', () => {
  it('should get all transactions for the user', async () => {
    const response = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should reject access to account without token', async () => {
    const response = await request(app)
      .get('/transactions');

    expect(response.statusCode).toBe(403);
  });
});

describe('GET /transactions/:id', () => {
  it('should get a transaction by id', async () => {
    const response = await request(app)
      .get(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', transactionId);
  });

  it('should reject access to account without token', async () => {
    const response = await request(app)
      .get(`/transactions/${transactionId}`);

    expect(response.statusCode).toBe(403);
  });
});

describe('PUT /transactions/:id', () => {
  it('should update a transaction', async () => {
    const updateData = { amount: 200, type: 'withdrawal' };

    const response = await request(app)
      .put(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('amount', 200);
    expect(response.body).toHaveProperty('type', 'withdrawal');
  });

  it('should reject access to account without token', async () => {
    const updateData = { amount: 200, type: 'withdrawal' };

    const response = await request(app)
      .put(`/transactions/${transactionId}`)
      .send(updateData);

    expect(response.statusCode).toBe(403);
  });
});

describe('DELETE /transactions/:id', () => {
  it('should delete a transaction', async () => {
    const response = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });

  it('should reject access to account without token', async () => {
    const response = await request(app)
      .delete(`/transactions/${transactionId}`);

    expect(response.statusCode).toBe(403);
  });
});
