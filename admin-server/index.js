import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'kheti_secret_key_2026';
const MONGO_URI  = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kheticonnect';

// ── Vehicle Schema (shared with main server) ──────────────────────────────────
const VehicleSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  vehicleType: { type: String, required: true },
  capacity:    { type: String, required: true },
  from:        { type: String, required: true },
  to:          { type: String, required: true },
  price:       { type: Number, required: true },
  priceUnit:   { type: String, default: 'trip' },
  eta:         { type: String, default: '4–6 hrs' },
  phone:       { type: String, default: '+91-90000-00000' },
  features:    { type: [String], default: ['GPS Tracked', 'Insured'] },
  badge:       { type: String, default: null },
  rating:      { type: Number, default: 5.0 },
  reviews:     { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

// Seed default data
const SEED = [
  { name: 'Ramesh Transport Co.', vehicleType: 'Refrigerated', capacity: '5 MT', from: 'Nashik', to: 'Mumbai', price: 3200, eta: '6–8 hrs', features: ['Cold Chain', 'GPS Tracked', 'Insured'], badge: 'Top Rated', rating: 4.8, reviews: 312, phone: '+91-98765-43210' },
  { name: 'Krishna Agri Logistics', vehicleType: 'Container', capacity: '10 MT', from: 'Pune', to: 'Delhi', price: 18500, eta: '28–32 hrs', features: ['GPS Tracked', 'Insured'], badge: 'Verified', rating: 4.6, reviews: 198, phone: '+91-97654-32109' },
  { name: 'Suresh Mini Truck', vehicleType: 'Mini Truck', capacity: '1.5 MT', from: 'Nagpur', to: 'Wardha', price: 850, eta: '1.5–2 hrs', features: ['GPS Tracked'], badge: null, rating: 4.5, reviews: 87, phone: '+91-96543-21098' },
];

// ── Connect DB ────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('[Admin] MongoDB connected');
    const count = await Vehicle.countDocuments();
    if (count === 0) await Vehicle.insertMany(SEED);
  })
  .catch(err => console.warn('[Admin] MongoDB offline:', err.message));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html

// ── Simple Admin Auth ─────────────────────────────────────────────────────────
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@kheti.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /admin/login
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token, message: 'Welcome, Admin!' });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Auth middleware
const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error();
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// GET /admin/vehicles — list all
app.get('/admin/vehicles', adminAuth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({ success: true, vehicles });
  } catch {
    res.json({ success: true, vehicles: SEED });
  }
});

// POST /admin/vehicles — add new
app.post('/admin/vehicles', adminAuth, async (req, res) => {
  const { name, vehicleType, capacity, from, to, price, eta, phone, badge, features } = req.body;
  if (!name || !vehicleType || !capacity || !from || !to || !price)
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  try {
    const v = await Vehicle.create({ name, vehicleType, capacity, from, to, price: Number(price), eta, phone, badge, features });
    res.status(201).json({ success: true, message: 'Vehicle added successfully', vehicle: v });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /admin/vehicles/:id — delete
app.delete('/admin/vehicles/:id', adminAuth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /admin/vehicles/:id — toggle availability
app.patch('/admin/vehicles/:id', adminAuth, async (req, res) => {
  try {
    const v = await Vehicle.findById(req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    v.available = !v.available;
    await v.save();
    res.json({ success: true, message: `Vehicle marked ${v.available ? 'Available' : 'Unavailable'}`, vehicle: v });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve admin panel HTML for all other GET routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Admin Server] Running at http://localhost:${PORT}`);
});
