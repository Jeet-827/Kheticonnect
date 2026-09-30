import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

describe('KhetiConnect API Automated Integration Suite', () => {

  let userToken = '';
  let refreshToken = '';
  let createdProductId = '';
  let auctionProductId = '';

  before(async () => {
    process.env.NODE_ENV = 'test';
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  // 1. Health Check
  test('GET /api/health - should return 200 OK and health status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.message, 'string');
  });

  // 2. Auth - Login Demo Farmer
  test('POST /api/auth/login - should authenticate valid user credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'farmer@kheti.com', password: 'password123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.accessToken);
    userToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  // 3. Auth - Get Profile (/api/auth/me)
  test('GET /api/auth/me - should return authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.user);
    assert.equal(res.body.user.email, 'farmer@kheti.com');
  });

  // 4. Auth - Token Refresh
  test('POST /api/auth/refresh - should issue new access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.accessToken);
  });

  // 5. Marketplace Products - GET
  test('GET /api/products - should return product list', async () => {
    const res = await request(app).get('/api/products');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.products));
  });

  // 6. Marketplace Products - POST (Create fixed listing)
  test('POST /api/products - should create a new fixed produce listing', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Fresh Test Wheat',
        category: 'Grains',
        pricePerUnit: 2200,
        unit: 'Quintal',
        availableQuantity: 80,
        listingType: 'fixed',
        description: 'High quality tested wheat'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.product);
    createdProductId = res.body.product.id;
  });

  // 7. Marketplace Products - POST (Create auction listing & Bid)
  test('POST /api/products - should create auction crop & accept valid bid', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Auction Rice 1121',
        category: 'Grains',
        pricePerUnit: 4000,
        unit: 'Quintal',
        availableQuantity: 50,
        listingType: 'auction',
        description: 'Basmati auction stock'
      });

    assert.equal(createRes.status, 201);
    auctionProductId = createRes.body.product.id;

    // Place bid
    const bidRes = await request(app)
      .post(`/api/products/${auctionProductId}/bid`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 4500 });

    assert.equal(bidRes.status, 200);
    assert.equal(bidRes.body.success, true);
    assert.equal(bidRes.body.product.currentHighestBid, 4500);
  });

  // 8. Transport - GET & Book
  test('GET /api/transport & POST /api/transport/book', async () => {
    const getRes = await request(app).get('/api/transport');
    assert.equal(getRes.status, 200);
    assert.ok(Array.isArray(getRes.body.vehicles));

    if (getRes.body.vehicles.length > 0) {
      const vId = getRes.body.vehicles[0]._id || getRes.body.vehicles[0].id;
      const bookRes = await request(app)
        .post('/api/transport/book')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          vehicleId: vId,
          pickupLocation: 'Ludhiana',
          dropLocation: 'Delhi',
          cargo: 'Wheat Grain'
        });

      assert.equal(bookRes.status, 201);
      assert.equal(bookRes.body.success, true);
      assert.ok(bookRes.body.booking.bookingId);
    }
  });

  // 9. Community Forum - GET & POST
  test('GET & POST /api/community/forum - should manage Q&A threads', async () => {
    const getRes = await request(app).get('/api/community/forum');
    assert.equal(getRes.status, 200);

    const postRes = await request(app)
      .post('/api/community/forum')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'How to manage organic wheat rust pest?',
        content: 'Seeking suggestions for biological fungicides.'
      });

    assert.equal(postRes.status, 201);
    assert.equal(postRes.body.success, true);
    assert.ok(postRes.body.thread);
  });

  // 10. Admin Overview Stats
  test('GET /api/admin/stats - should return platform operational statistics', async () => {
    // Admin login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kheti.com', password: 'password123' });

    const adminToken = loginRes.body.accessToken || 'demo-access-token-admin';

    const statsRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(statsRes.status, 200);
    assert.equal(statsRes.body.success, true);
    assert.ok(statsRes.body.stats);
  });

  // 11. Auth Logout
  test('POST /api/auth/logout - should successfully clear session', async () => {
    const res = await request(app).post('/api/auth/logout');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

});
