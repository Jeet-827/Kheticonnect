import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Product from './models/Product.js';
import MandiRate from './models/MandiRate.js';
import { Guide, Scheme, Thread, Review } from './models/Community.js';
import {
  seedUsers,
  seedProducts,
  seedMandiRates,
  seedGuides,
  seedSchemes,
  seedThreads,
  seedReviews
} from './data/seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kheticonnect';

export const runSeed = async () => {
  console.log('[SEED] Starting KhetiConnect database seeding...');
  
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
      console.log(`[SEED] Connected to MongoDB: ${mongoose.connection.host}`);
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      MandiRate.deleteMany({}),
      Guide.deleteMany({}),
      Scheme.deleteMany({}),
      Thread.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('[SEED] Cleared previous database collections.');

    // 1. Seed Users
    const createdUsers = [];
    for (const u of seedUsers) {
      const userDoc = await User.create(u);
      createdUsers.push(userDoc);
    }
    console.log(`[SEED] Inserted ${createdUsers.length} Users (Farmers & Buyers).`);

    const primaryFarmer = createdUsers.find(u => u.role === 'farmer') || createdUsers[0];

    // 2. Seed Products (link farmerId if matched)
    const productsWithFarmerIds = seedProducts.map((p, index) => {
      const matchingFarmer = createdUsers.find(u => u.name === p.farmerName) || primaryFarmer;
      return {
        ...p,
        farmerId: matchingFarmer._id.toString()
      };
    });

    const createdProducts = await Product.insertMany(productsWithFarmerIds);
    console.log(`[SEED] Inserted ${createdProducts.length} Crop Listings.`);

    // 3. Seed Mandi Rates
    const createdMandi = await MandiRate.insertMany(seedMandiRates);
    console.log(`[SEED] Inserted ${createdMandi.length} Live Mandi Rates.`);

    // 4. Seed Community
    await Promise.all([
      Guide.insertMany(seedGuides),
      Scheme.insertMany(seedSchemes),
      Thread.insertMany(seedThreads),
      Review.insertMany(seedReviews)
    ]);
    console.log('[SEED] Inserted Guides, Schemes, Threads, and Reviews successfully!');

    console.log('\n=========================================');
    console.log('✅ KHETICONNECT DATABASE SEEDED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Demo Credentials:');
    console.log('🌾 Farmer: farmer@kheti.com  | Password: password123');
    console.log('🛒 Buyer:  buyer@kheti.com   | Password: password123');
    console.log('=========================================\n');

    return {
      success: true,
      counts: {
        users: createdUsers.length,
        products: createdProducts.length,
        mandiRates: createdMandi.length,
        guides: seedGuides.length,
        schemes: seedSchemes.length,
        threads: seedThreads.length,
        reviews: seedReviews.length
      }
    };
  } catch (err) {
    console.error('[SEED ERROR]', err);
    throw err;
  }
};

// If run directly: node seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
