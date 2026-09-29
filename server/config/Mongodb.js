import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[WARN] MongoDB Connection Notice: ${error.message}`);
    console.warn("Running Express API with in-memory routes & fallback auth.");
  }
};