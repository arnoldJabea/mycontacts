jest.setTimeout(20000);

require('./setupTestDB');
const request = require('supertest');
const app = require('../src/app');

describe('Contacts Endpoints', () => {
  let token;
  let contactId;
  beforeAll(async () => {
    const email = `user+${Date.now()}@mc.local`;
    const reg = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Passw0rd!' });
    token = reg.body.token;
  });

  it('should create a contact', async () => {
    const res = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Test', lastName: 'User', phone: '0612345678' });
    if (res.statusCode !== 201) console.log('Create contact error:', res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    contactId = res.body._id;
  });

  it('should list contacts', async () => {
    const res = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a contact', async () => {
    const res = await request(app)
      .patch(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '0700000000' });
    if (res.statusCode !== 200) console.log('Update contact error:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe('0700000000');
  });

  it('should delete a contact', async () => {
    const res = await request(app)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    if (res.statusCode !== 200) console.log('Delete contact error:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
