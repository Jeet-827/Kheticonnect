import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDb } from './config/Mongodb.js';

// Route handlers
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import imagekitRoutes from './routes/imagekit.js';
import communityRoutes from './routes/community.js';
import chatRoutes from './routes/chat.js';
import { runSeed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from both local and root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Sensible development fallbacks for local run
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'kheti_secret_key_development_2026_super_secure';
  process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'kheti_refresh_secret_development_2026_super_secure';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kheticonnect';
}


// Global process error handlers — log and exit so the host can restart cleanly (Bug #9)
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});

// Production environment: crash immediately if JWT secrets are missing (Critical #4)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'kheti_secret_key_2026') {
    console.error('[FATAL] JWT_SECRET must be set to a strong, unique value in production.');
    process.exit(1);
  }
  if (!process.env.REFRESH_SECRET || process.env.REFRESH_SECRET === 'kheti_refresh_secret_key_2026') {
    console.error('[FATAL] REFRESH_SECRET must be set to a strong, unique value in production.');
    process.exit(1);
  }
}

// Connect Database
connectDb().catch((err) => {
  console.error('[STARTUP] Database initialization failed:', err.message);
});

const app = express();

// ─── Security Headers & Middleware ──────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Trust first proxy (Render, Vercel, etc.) so rate limiter sees real IPs (Bug #10)
app.set('trust proxy', 1);

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Strict rate limiter for auth routes (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── Core Middleware ─────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://kheticonnect-3.onrender.com',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);

// ─── Database Seeding Endpoint ───────────────────────────────────────────────
app.all('/api/seed', async (req, res) => {
  try {
    const result = await runSeed();
    res.json({
      success: true,
      message: 'KhetiConnect database seeded successfully!',
      details: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed database: ' + err.message
    });
  }
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    message: dbState === 1 ? 'Kheti-Connect API is running smoothly' : 'API running but database is unavailable',
    database: dbStatus[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ─── Production Client Static Assets (Full-Stack Render Deployment) ───────────
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA client fallback for non-API routes
  app.get('/{*splat}', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ─── 404 Handler for Unhandled API Routes ────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
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
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[INFO] Kheti-Connect Backend running on port ${PORT}`);
    console.log(`[INFO] Health status: http://localhost:${PORT}/api/health`);
  });
}

export default app;


