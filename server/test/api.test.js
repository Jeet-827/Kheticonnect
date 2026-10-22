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
    const start = Date.now();
    while (mongoose.connection.readyState !== 1 && Date.now() - start < 10000) {
      await new Promise(r => setTimeout(r, 100));
    }
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

  // 8. ImageKit - GET auth & upload check
  test('GET /api/imagekit/auth & POST /api/imagekit/upload', async () => {
    const authRes = await request(app).get('/api/imagekit/auth');
    assert.equal(authRes.status, 200);

    const uploadRes = await request(app)
      .post('/api/imagekit/upload')
      .send({
        file: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
        fileName: 'test_crop.jpg'
      });
    assert.equal(uploadRes.status, 200);
    assert.equal(uploadRes.body.success, true);
    assert.ok(uploadRes.body.url);
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



  // 11. Auth Logout
  test('POST /api/auth/logout - should successfully clear session', async () => {
    const res = await request(app).post('/api/auth/logout');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  // 12. Multilingual Chatbot - Suggested Questions
  test('GET /api/chat/suggested - should return quick suggestions for language', async () => {
    const res = await request(app).get('/api/chat/suggested?lang=hi');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.suggestions));
    assert.ok(res.body.suggestions.length > 0);
  });

  // 13. Multilingual Chatbot - Post Chat Message
  test('POST /api/chat - should process query and return intelligent response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        message: 'How can I sell produce on KhetiConnect?',
        language: 'en'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.reply && res.body.reply.length > 20);
    assert.ok(res.body.model);
  });

});
