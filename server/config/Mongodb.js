import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kheticonnect';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if database is empty
    try {
      const Product = (await import('../models/Product.js')).default;
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('[DATABASE] No products found. Automatically seeding initial data...');
        const { runSeed } = await import('../seed.js');
        await runSeed();
      }
    } catch (seedErr) {
      console.warn('[DATABASE] Auto-seed check notice:', seedErr.message);
    }
  } catch (error) {
    console.error(`[ERROR] MongoDB Connection Failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('[FATAL] Cannot run without MongoDB in production. Exiting.');
      process.exit(1);
    }
    console.warn(`[WARN] Running without MongoDB in development mode (Attempted: ${uri}). DB-dependent routes will fail.`);
  }
};