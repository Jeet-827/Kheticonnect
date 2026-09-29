import express from 'express';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Initial advisory guides
let guides = [
  {
    id: 'g-1',
    title: 'Drip Irrigation Setup: Save 60% Water & Boost Yields',
    category: 'Water Management',
    readTime: '6 min read',
    author: 'Dr. V. K. Kurien (Agri Scientist)',
    summary: 'A step-by-step guide to installing low-cost drip emitter lines in wheat and vegetable crops to increase fertilizer efficiency.',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'g-2',
    title: 'Natural Pest Control with Neem Oil & Jeevamrut',
    category: 'Organic Farming',
    readTime: '8 min read',
    author: 'Subhash Palekar Agro Trust',
    summary: 'Learn how to prepare zero-budget organic pest repellent formulas at home using cow urine, neem leaves, and jaggery.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'g-3',
    title: 'e-NAM & Direct Mandi Selling Process Explained',
    category: 'Market Advisory',
    readTime: '5 min read',
    author: 'Ministry of Agriculture Guide',
    summary: 'How farmers can get maximum prices by bypassing middlemen commission agents through transparent online bidding.',
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=600&auto=format&fit=crop'
  }
];

// Initial government schemes
let schemes = [
  {
    id: 's-1',
    title: 'PM-Kisan Samman Nidhi (PM-KISAN)',
    benefit: '₹6,000 / year direct bank transfer in 3 installments',
    eligibility: 'All small & marginal landholding farmer families',
    linkText: 'Check PM-Kisan Status'
  },
  {
    id: 's-2',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Comprehensive crop insurance cover against natural disasters & pests at 1.5% - 2% premium',
    eligibility: 'All farmers growing notified crops in notified areas',
    linkText: 'Apply Crop Insurance'
  },
  {
    id: 's-3',
    title: 'Kisan Credit Card (KCC) Scheme',
    benefit: 'Short-term credit loans up to ₹3 Lakhs at concessional 4% interest rate',
    eligibility: 'Farmers, tenant farmers, sharecroppers, and SHGs',
    linkText: 'Apply KCC Online'
  }
];

// @desc    Get all advisory guides
// @route   GET /api/community/guides
// @access  Public
router.get('/guides', (req, res) => {
  res.status(200).json({ success: true, count: guides.length, guides });
});

// @desc    Add advisory guide (Admin Only)
// @route   POST /api/community/guides
// @access  Private / Admin Only
router.post('/guides', protect, adminOnly, (req, res) => {
  try {
    const { title, category, readTime, author, summary, image } = req.body;
    if (!title || !category || !summary) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and summary for the guide.' });
    }

    const newGuide = {
      id: `g-${Date.now()}`,
      title,
      category,
      readTime: readTime || '5 min read',
      author: author || 'Kheti Advisory Team',
      summary,
      image: image || 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop'
    };

    guides.unshift(newGuide);

    res.status(201).json({
      success: true,
      message: 'Advisory guide added successfully by Admin',
      guide: newGuide,
      guides
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get all government schemes
// @route   GET /api/community/schemes
// @access  Public
router.get('/schemes', (req, res) => {
  res.status(200).json({ success: true, count: schemes.length, schemes });
});

// @desc    Add government scheme (Admin Only)
// @route   POST /api/community/schemes
// @access  Private / Admin Only
router.post('/schemes', protect, adminOnly, (req, res) => {
  try {
    const { title, benefit, eligibility, linkText } = req.body;
    if (!title || !benefit || !eligibility) {
      return res.status(400).json({ success: false, message: 'Please provide title, benefit, and eligibility for the scheme.' });
    }

    const newScheme = {
      id: `s-${Date.now()}`,
      title,
      benefit,
      eligibility,
      linkText: linkText || 'Apply Scheme Online'
    };

    schemes.unshift(newScheme);

    res.status(201).json({
      success: true,
      message: 'Government scheme added successfully by Admin',
      scheme: newScheme,
      schemes
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
