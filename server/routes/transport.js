import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Seed default vehicles if DB is empty
const SEED = [
  { name: 'Ramesh Transport Co.', vehicleType: 'Refrigerated', capacity: '5 MT', from: 'Nashik', to: 'Mumbai', price: 3200, eta: '6–8 hrs', features: ['Cold Chain', 'GPS Tracked', 'Insured'], badge: 'Top Rated', rating: 4.8, reviews: 312, phone: '+91-98765-43210' },
  { name: 'Krishna Agri Logistics', vehicleType: 'Container', capacity: '10 MT', from: 'Pune', to: 'Delhi', price: 18500, eta: '28–32 hrs', features: ['GPS Tracked', 'Insured'], badge: 'Verified', rating: 4.6, reviews: 198, phone: '+91-97654-32109' },
  { name: 'Suresh Mini Truck', vehicleType: 'Mini Truck', capacity: '1.5 MT', from: 'Nagpur', to: 'Wardha', price: 850, eta: '1.5–2 hrs', features: ['GPS Tracked'], badge: null, rating: 4.5, reviews: 87, phone: '+91-96543-21098' },
];

export const seedVehicles = async () => {
  const count = await Vehicle.countDocuments();
  if (count === 0) await Vehicle.insertMany(SEED);
};

// GET /api/transport — list all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({ success: true, count: vehicles.length, vehicles });
  } catch {
    res.json({ success: true, count: SEED.length, vehicles: SEED });
  }
});

// POST /api/transport/book — book a vehicle (auth required)
router.post('/book', protect, async (req, res) => {
  const { vehicleId, pickupLocation, dropLocation, cargo, scheduledDate } = req.body;
  let vehicle;
  try { vehicle = await Vehicle.findById(vehicleId); } catch { /* invalid id */ }

  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

  const booking = {
    bookingId: `BK-${Date.now()}`,
    userId: req.user._id,
    vehicleId,
    vehicleName: vehicle.name,
    pickupLocation: pickupLocation || vehicle.from,
    dropLocation:   dropLocation   || vehicle.to,
    cargo:          cargo          || 'Agricultural Produce',
    scheduledDate:  scheduledDate  || new Date().toISOString().split('T')[0],
    totalAmount:    vehicle.price,
    status: 'Confirmed',
  };
  res.status(201).json({ success: true, message: 'Booked successfully!', booking });
});

// POST /api/transport — add vehicle (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, vehicleType, capacity, from, to, price, eta, features, phone, badge } = req.body;
  if (!name || !vehicleType || !capacity || !from || !to || !price)
    return res.status(400).json({ success: false, message: 'Missing required fields' });

  try {
    const v = await Vehicle.create({ name, vehicleType, capacity, from, to, price: Number(price), eta, features, phone, badge });
    res.status(201).json({ success: true, message: 'Vehicle added', vehicle: v });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/transport/:id — remove vehicle (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
