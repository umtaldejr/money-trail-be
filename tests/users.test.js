const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const app = require('../app');

let server;
let userId;
let userEmail;
let token;

beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const response = await request(app)
      .post('/users')
      .send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', userData.email);
    userId = response.body.id;
    userEmail = response.body.email;
  });

  it('should fail when data is invalid', async () => {
    const userData = { email: 'test2@example.com' };
    const response = await request(app)
      .post('/users')
      .send(userData);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });

  it('should fail when email is already taken', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const response = await request(app)
      .post('/users')
      .send(userData);
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('error', 'Email already exists');
  });
});

describe('POST /auth', () => {
  it('should authenticate the user', async () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const response = await request(app)
      .post('/auth')
      .send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });
});

describe('GET /users/:id', () => {
  it('should return the user', async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', userEmail);
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .get(`/users/${userId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when requesting data from other user', async () => {
    const response = await request(app)
      .get(`/users/${uuidv4()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});

describe('PUT /users/:id', () => {
  it('should update the user', async () => {
    const updateData = { email: 'updated@example.com', password: 'newpassword123' };
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', updateData.email);
    userEmail = response.body.email;
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({ email: 'unauthorized@example.com' });
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when updating data from other user', async () => {
    const updateData = { email: 'updated@example.com', password: 'newpassword123' };
    const response = await request(app)
      .put(`/users/${uuidv4()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});

describe('DELETE /users/:id', () => {
  it('should delete the user', async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
    const getResponse = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.statusCode).toBe(404);
    expect(getResponse.body).toHaveProperty('error', 'User not found');
  });

  it('should reject access without token', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when deleting other user', async () => {
    const response = await request(app)
      .delete(`/users/${uuidv4()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});
