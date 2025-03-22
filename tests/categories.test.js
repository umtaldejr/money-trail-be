const request = require('supertest');
const app = require('../app');
const { seedUsers, seedCategories, USER_CREDENTIALS } = require('./aux/seed');

let server;
let users;
let token;
let categories;
let categoryId;
let otherCategoryId;

beforeAll(async () => {
  server = app.listen(3000);
  users = await seedUsers();
  categories = await seedCategories();
  otherCategoryId = categories.find(cat => cat.userId !== users[0].id).id;

  token = (await request(app)
    .post('/auth')
    .send(USER_CREDENTIALS))
    .body.token;
});

afterAll((done) => {
  server.close(done);
});

describe('POST /categories', () => {
  it('should create a new category', async () => {
    const categoryData = { name: 'Food' };
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('name');

    categoryId = response.body.id;
  });

  it('should reject access without token', async () => {
    const categoryData = { name: 'Food' };
    const response = await request(app)
      .post('/categories')
      .send(categoryData);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('GET /categories', () => {
  it('should get all categories for the user', async () => {
    const response = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .get('/categories');
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });
});

describe('GET /categories/:id', () => {
  it('should get a category by id', async () => {
    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', categoryId);
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .get(`/categories/${categoryId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when requesting data from other user', async () => {
    const response = await request(app)
      .get(`/categories/${otherCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Category not found or access denied');
  });
});

describe('PUT /categories/:id', () => {
  it('should update a category', async () => {
    const updateData = { name: 'Groceries' };
    const response = await request(app)
      .put(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Groceries');
  });

  it('should reject access without token', async () => {
    const updateData = { name: 'Groceries' };
    const response = await request(app)
      .put(`/categories/${categoryId}`)
      .send(updateData);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when updating data from other user', async () => {
    const updateData = { name: 'Groceries' };
    const response = await request(app)
      .put(`/categories/${otherCategoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Category not found or access denied');
  });
});

describe('DELETE /categories/:id', () => {
  it('should delete a category', async () => {
    const response = await request(app)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .delete(`/categories/${categoryId}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  it('should fail when deleting data from other user', async () => {
    const response = await request(app)
      .delete(`/categories/${otherCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Category not found or access denied');
  });
});
