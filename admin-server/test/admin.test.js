import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

describe('Admin Server Integration Suite', () => {
  let adminToken = '';
  let createdVehicleId = '';

  before(() => {
    process.env.NODE_ENV = 'test';
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test('POST /admin/login - should authenticate admin credentials', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({ email: 'admin@kheti.com', password: 'admin123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    adminToken = res.body.token;
  });

  test('GET /admin/vehicles - should require bearer token', async () => {
    const res = await request(app).get('/admin/vehicles');
    assert.equal(res.status, 401);
  });

  test('GET /admin/vehicles - should list vehicles when authenticated', async () => {
    const res = await request(app)
      .get('/admin/vehicles')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.vehicles));
  });

  test('POST /admin/vehicles - should add a new vehicle', async () => {
    const res = await request(app)
      .post('/admin/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Express Agro Logistics',
        vehicleType: 'Refrigerated',
        capacity: '8 MT',
        from: 'Ludhiana',
        to: 'Delhi',
        price: 9500,
        phone: '+91-99999-11111'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.vehicle);
    createdVehicleId = res.body.vehicle._id || res.body.vehicle.id;
  });

  test('DELETE /admin/vehicles/:id - should delete vehicle', async () => {
    if (!createdVehicleId) return;
    const res = await request(app)
      .delete(`/admin/vehicles/${createdVehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});
