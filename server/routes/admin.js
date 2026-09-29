import express from 'express';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';
import User from '../models/User.js';

const router = express.Router();

// ── Protect all admin routes ──────────────────────────────────────────────────
router.use(protect, adminOnly);

// Mock in-memory data storage for admin management
let adminVehicles = [
  {
    id: 'v1',
    name: 'Ramesh Transport Co.',
    vehicleType: 'Refrigerated',
    capacity: '5 MT',
    from: 'Nashik',
    to: 'Mumbai',
    price: 3200,
    eta: '6-8 hrs',
    features: ['Cold Chain', 'GPS Tracked', 'Insured'],
    available: true,
    phone: '+91-98765-43210'
  },
  {
    id: 'v2',
    name: 'Krishna Agri Logistics',
    vehicleType: 'Container',
    capacity: '10 MT',
    from: 'Pune',
    to: 'Delhi',
    price: 18500,
    eta: '28-32 hrs',
    features: ['GPS Tracked', 'Insured'],
    available: true,
    phone: '+91-97654-32109'
  },
  {
    id: 'v3',
    name: 'Suresh Mini Truck',
    vehicleType: 'Mini Truck',
    capacity: '1.5 MT',
    from: 'Nagpur',
    to: 'Wardha',
    price: 850,
    eta: '1.5-2 hrs',
    features: ['GPS Tracked'],
    available: true,
    phone: '+91-96543-21098'
  }
];

let adminCrops = [
  {
    id: 'crop-101',
    title: 'Premium Organic Sharbati Wheat',
    category: 'Grains',
    farmerName: 'Sardar Ramesh Singh',
    farmerLocation: 'Ludhiana, Punjab',
    pricePerUnit: 2400,
    unit: 'Quintal',
    availableQuantity: 150,
    listingType: 'auction',
    currentHighestBid: 2450
  },
  {
    id: 'crop-102',
    title: 'Fresh Farm-Pick Tomatoes',
    category: 'Vegetables',
    farmerName: 'Sunita Patil',
    farmerLocation: 'Nashik, Maharashtra',
    pricePerUnit: 1800,
    unit: 'Quintal',
    availableQuantity: 45,
    listingType: 'fixed',
    currentHighestBid: null
  }
];

let adminGuides = [
  {
    id: 'g-1',
    title: 'Drip Irrigation Setup: Save 60% Water & Boost Yields',
    category: 'Water Management',
    readTime: '6 min read',
    author: 'Dr. V. K. Kurien (Agri Scientist)',
    summary: 'A step-by-step guide to installing low-cost drip emitter lines in wheat and vegetable crops to increase fertilizer efficiency.'
  },
  {
    id: 'g-2',
    title: 'Natural Pest Control with Neem Oil & Jeevamrut',
    category: 'Organic Farming',
    readTime: '8 min read',
    author: 'Subhash Palekar Agro Trust',
    summary: 'Learn how to prepare zero-budget organic pest repellent formulas at home using cow urine, neem leaves, and jaggery.'
  }
];

let adminSchemes = [
  {
    id: 's-1',
    title: 'PM-Kisan Samman Nidhi (PM-KISAN)',
    benefit: 'Rs.6,000 / year direct bank transfer in 3 installments',
    eligibility: 'All small & marginal landholding farmer families',
    linkText: 'Check PM-Kisan Status'
  },
  {
    id: 's-2',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Comprehensive crop insurance cover against natural disasters & pests at 1.5% - 2% premium',
    eligibility: 'All farmers growing notified crops in notified areas',
    linkText: 'Apply Crop Insurance'
  }
];

let adminMandiRates = [
  { crop: 'Wheat (Sharbati)', location: 'Khanna Mandi, PB', price: 2350, unit: 'Quintal', change: '+2.4%' },
  { crop: 'Basmati Rice 1121', location: 'Karnal Mandi, HR', price: 4200, unit: 'Quintal', change: '+1.8%' },
  { crop: 'Organic Tomato', location: 'Nashik Mandi, MH', price: 1850, unit: 'Quintal', change: '-0.5%' },
  { crop: 'Alphonso Mango', location: 'Ratnagiri, MH', price: 850, unit: 'Box (12kg)', change: '+3.1%' }
];

// ─── 1. Platform Overview Stats ───────────────────────────────────────────────
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    let userCount = 2;
    try {
      userCount = await User.countDocuments();
    } catch { /* DB offline fallback */ }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount || 840,
        totalVehicles: adminVehicles.length,
        totalCrops: adminCrops.length,
        totalGuides: adminGuides.length,
        totalSchemes: adminSchemes.length,
        totalMandiRates: adminMandiRates.length,
        tradeVolume: 'Rs.48 Cr',
        systemStatus: 'Operational'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── 2. Logistics & Transport Management ─────────────────────────────────────
// @route   GET /api/admin/transport
router.get('/transport', (req, res) => {
  res.status(200).json({ success: true, count: adminVehicles.length, vehicles: adminVehicles });
});

// @route   POST /api/admin/transport
router.post('/transport', (req, res) => {
  try {
    const { name, vehicleType, capacity, from, to, price, eta, phone, features } = req.body;
    if (!name || !from || !to || !price) {
      return res.status(400).json({ success: false, message: 'Please provide all vehicle details.' });
    }

    const newVehicle = {
      id: `v_${Date.now()}`,
      name,
      vehicleType: vehicleType || 'Refrigerated',
      capacity: capacity || '5 MT',
      from,
      to,
      price: Number(price),
      eta: eta || '4-6 hrs',
      phone: phone || '+91-98765-43210',
      features: features || ['GPS Tracked', 'Insured'],
      available: true
    };

    adminVehicles.unshift(newVehicle);
    res.status(201).json({ success: true, message: 'Transport vehicle registered by Admin', vehicle: newVehicle, vehicles: adminVehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/transport/:id
router.delete('/transport/:id', (req, res) => {
  adminVehicles = adminVehicles.filter(v => v.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Transport vehicle removed', vehicles: adminVehicles });
});

// ─── 3. Produce Management ───────────────────────────────────────────────────
// @route   GET /api/admin/crops
router.get('/crops', (req, res) => {
  res.status(200).json({ success: true, count: adminCrops.length, crops: adminCrops });
});

// @route   POST /api/admin/crops
router.post('/crops', (req, res) => {
  try {
    const { title, category, farmerName, farmerLocation, pricePerUnit, unit, availableQuantity, listingType } = req.body;
    if (!title || !pricePerUnit) {
      return res.status(400).json({ success: false, message: 'Please provide title and price.' });
    }

    const newCrop = {
      id: `crop-${Date.now()}`,
      title,
      category: category || 'Grains',
      farmerName: farmerName || 'Admin Verified Farm',
      farmerLocation: farmerLocation || 'India',
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'Quintal',
      availableQuantity: Number(availableQuantity) || 50,
      listingType: listingType || 'fixed',
      currentHighestBid: listingType === 'auction' ? Number(pricePerUnit) : null
    };

    adminCrops.unshift(newCrop);
    res.status(201).json({ success: true, message: 'Crop listing published by Admin', crop: newCrop, crops: adminCrops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/crops/:id
router.delete('/crops/:id', (req, res) => {
  adminCrops = adminCrops.filter(c => c.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Crop produce listing removed', crops: adminCrops });
});

// ─── 4. Advisory Guides Management ───────────────────────────────────────────
// @route   GET /api/admin/guides
router.get('/guides', (req, res) => {
  res.status(200).json({ success: true, count: adminGuides.length, guides: adminGuides });
});

// @route   POST /api/admin/guides
router.post('/guides', (req, res) => {
  try {
    const { title, category, readTime, author, summary } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ success: false, message: 'Please provide title and summary.' });
    }

    const newGuide = {
      id: `g-${Date.now()}`,
      title,
      category: category || 'Organic Farming',
      readTime: readTime || '5 min read',
      author: author || 'Agri Advisory Council',
      summary
    };

    adminGuides.unshift(newGuide);
    res.status(201).json({ success: true, message: 'Advisory guide published', guide: newGuide, guides: adminGuides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/guides/:id
router.delete('/guides/:id', (req, res) => {
  adminGuides = adminGuides.filter(g => g.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Advisory guide removed', guides: adminGuides });
});

// ─── 5. Government Schemes Management ─────────────────────────────────────────
// @route   GET /api/admin/schemes
router.get('/schemes', (req, res) => {
  res.status(200).json({ success: true, count: adminSchemes.length, schemes: adminSchemes });
});

// @route   POST /api/admin/schemes
router.post('/schemes', (req, res) => {
  try {
    const { title, benefit, eligibility, linkText } = req.body;
    if (!title || !benefit) {
      return res.status(400).json({ success: false, message: 'Please provide scheme title and benefit.' });
    }

    const newScheme = {
      id: `s-${Date.now()}`,
      title,
      benefit,
      eligibility: eligibility || 'All eligible farmers',
      linkText: linkText || 'Apply Scheme Online'
    };

    adminSchemes.unshift(newScheme);
    res.status(201).json({ success: true, message: 'Scheme published', scheme: newScheme, schemes: adminSchemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/schemes/:id
router.delete('/schemes/:id', (req, res) => {
  adminSchemes = adminSchemes.filter(s => s.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Scheme removed', schemes: adminSchemes });
});

// ─── 6. Live Mandi Spot Rates Management ──────────────────────────────────────
// @route   GET /api/admin/mandi
router.get('/mandi', (req, res) => {
  res.status(200).json({ success: true, count: adminMandiRates.length, mandiRates: adminMandiRates });
});

// @route   POST /api/admin/mandi
router.post('/mandi', (req, res) => {
  try {
    const { crop, location, price, unit, change } = req.body;
    if (!crop || !price) {
      return res.status(400).json({ success: false, message: 'Please provide crop name and spot price.' });
    }

    const newRate = {
      crop,
      location: location || 'Central Mandi',
      price: Number(price),
      unit: unit || 'Quintal',
      change: change || '+0.0%'
    };

    adminMandiRates.unshift(newRate);
    res.status(201).json({ success: true, message: 'Mandi spot rate recorded', rate: newRate, mandiRates: adminMandiRates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/mandi/:crop
router.delete('/mandi/:crop', (req, res) => {
  adminMandiRates = adminMandiRates.filter(m => m.crop.toLowerCase() !== req.params.crop.toLowerCase());
  res.status(200).json({ success: true, message: 'Mandi spot rate deleted', mandiRates: adminMandiRates });
});

export default router;
