import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDb } from './config/Mongodb.js';

// Route handlers
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import transportRoutes, { seedVehicles } from './routes/transport.js';
import communityRoutes from './routes/community.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect Database (with automatic graceful in-memory fallback if offline)
connectDb().then(() => seedVehicles()).catch(() => {});

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server or same-origin)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    callback(null, true);
  },
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

// ─── Production Client Static Assets (Full-Stack Render Deployment) ───────────
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA client fallback for non-API routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ─── 404 Handler for Unhandled API Routes ────────────────────────────────────
app.use('/api/*', (req, res) => {
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


