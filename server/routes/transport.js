import express from 'express';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

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
    features: ['Cold Chain', 'GPS Tracked', 'Insured'],
    badge: 'Top Rated',
    avatar: 'truck',
    available: true,
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
    features: ['GPS Tracked', 'Insured'],
    badge: 'Verified',
    avatar: 'container',
    available: true,
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
    features: ['GPS Tracked'],
    badge: null,
    avatar: 'mini-truck',
    available: true,
    phone: '+91-96543-21098',
  }
];

// @desc    Get all transport vehicles
// @route   GET /api/transport
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: transportVehicles.length,
    vehicles: transportVehicles,
  });
});

// @desc    Book a transport vehicle
// @route   POST /api/transport/book
// @access  Private
router.post('/book', protect, (req, res) => {
  try {
    const { vehicleId, pickupLocation, dropLocation, cargo, scheduledDate } = req.body;
    const vehicle = transportVehicles.find(v => v.id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const booking = {
      bookingId: `BK-${Date.now()}`,
      userId: req.user._id,
      vehicleId,
      vehicleName: vehicle.name,
      pickupLocation: pickupLocation || vehicle.from,
      dropLocation: dropLocation || vehicle.to,
      cargo: cargo || 'Agricultural Produce',
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      totalAmount: vehicle.price,
      status: 'Confirmed'
    };

    res.status(201).json({
      success: true,
      message: 'Transport vehicle booked successfully!',
      booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Add transport vehicle (Admin Only)
// @route   POST /api/transport
// @access  Private / Admin Only
router.post('/', protect, adminOnly, (req, res) => {
  try {
    const { name, vehicleType, capacity, from, to, price, eta, features, phone, badge } = req.body;

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
      badge: badge || 'Admin Verified',
      avatar: 'truck',
      available: true,
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

// @desc    Delete transport vehicle (Admin Only)
// @route   DELETE /api/transport/:id
// @access  Private / Admin Only
router.delete('/:id', protect, adminOnly, (req, res) => {
  transportVehicles = transportVehicles.filter(v => v.id !== req.params.id);
  res.status(200).json({
    success: true,
    message: 'Vehicle removed by Administrator',
    vehicles: transportVehicles
  });
});

export default router;
