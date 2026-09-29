import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/Mongodb.js';

// Route handlers
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import transportRoutes from './routes/transport.js';
import communityRoutes from './routes/community.js';

dotenv.config();

// Connect Database (with automatic graceful in-memory fallback if offline)
connectDb();

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/community', communityRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kheti-Connect API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[SERVER ERROR] ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[INFO] Kheti-Connect Backend running on port ${PORT}`);
  console.log(`[INFO] Health status: http://localhost:${PORT}/api/health`);
});
