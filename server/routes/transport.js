import express from 'express';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Initial in-memory / database transport vehicles
let transportVehicles = [
  {
    id: 'v1',
    name: 'Ramesh Transport Co.',
    vehicleType: 'Refrigerated',
    capacity: '5 MT',
    from: 'Nashik',
    to: 'Mumbai',
    price: 3200,
    priceUnit: 'trip',
    rating: 4.8,
    reviews: 312,
    eta: '6–8 hrs',
    features: ['Cold Chain', 'GPS Tracked', 'Insured', '24/7 Support'],
    badge: 'Top Rated',
    avatar: 'truck',
    available: true,
    trips: 1820,
    phone: '+91-98765-43210',
  },
  {
    id: 'v2',
    name: 'Krishna Agri Logistics',
    vehicleType: 'Container',
    capacity: '10 MT',
    from: 'Pune',
    to: 'Delhi',
    price: 18500,
    priceUnit: 'trip',
    rating: 4.6,
    reviews: 198,
    eta: '28–32 hrs',
    features: ['GPS Tracked', 'Insured', 'Driver + Helper'],
    badge: 'Verified',
    avatar: 'container',
    available: true,
    trips: 940,
    phone: '+91-97654-32109',
  },
  {
    id: 'v3',
    name: 'Suresh Mini Truck',
    vehicleType: 'Mini Truck',
    capacity: '1.5 MT',
    from: 'Nagpur',
    to: 'Wardha',
    price: 850,
    priceUnit: 'trip',
    rating: 4.5,
    reviews: 87,
    eta: '1.5–2 hrs',
    features: ['GPS Tracked', 'Flexible Schedule'],
    badge: null,
    avatar: 'mini-truck',
    available: true,
    trips: 450,
    phone: '+91-96543-21098',
  }
];

// @desc    Get all transportation vehicles
// @route   GET /api/transport
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: transportVehicles.length,
    vehicles: transportVehicles,
  });
});

// @desc    Add transportation vehicle (Admin Only)
// @route   POST /api/transport
// @access  Private / Admin Only
router.post('/', protect, adminOnly, (req, res) => {
  try {
    const { name, vehicleType, capacity, from, to, price, eta, features, phone, badge, avatar } = req.body;

    if (!name || !vehicleType || !capacity || !from || !to || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required vehicle details: name, vehicleType, capacity, from, to, price'
      });
    }

    const newVehicle = {
      id: `v_${Date.now()}`,
      name,
      vehicleType,
      capacity,
      from,
      to,
      price: Number(price),
      priceUnit: 'trip',
      rating: 5.0,
      reviews: 1,
      eta: eta || '4–6 hrs',
      features: features || ['GPS Tracked', 'Insured'],
      badge: badge || 'Verified',
      avatar: avatar || 'truck',
      available: true,
      trips: 1,
      phone: phone || '+91-90000-00000',
    };

    transportVehicles.unshift(newVehicle);

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully by Admin',
      vehicle: newVehicle,
      vehicles: transportVehicles,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
