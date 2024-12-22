const request = require('supertest');
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
  it('deve criar um novo usuário', async () => {
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
});

describe('POST /auth', () => {
  it('deve autenticar o usuário', async () => {
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
  it('deve retornar o usuário', async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', userEmail);
  });

  it('deve rejeitar acesso sem token', async () => {
    const response = await request(app)
      .get(`/users/${userId}`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('PUT /users/:id', () => {

  it('deve atualizar o usuário', async () => {
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

  it('deve rejeitar acesso sem token', async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send({ email: 'unauthorized@example.com' });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('DELETE /users/:id', () => {
  it('deve deletar o usuário', async () => {
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

  it('deve rejeitar acesso sem token', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});
