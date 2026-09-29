import express from 'express';
import { protect } from '../middleware/protect.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

let products = [
  {
    id: 'crop-101',
    title: 'Premium Organic Sharbati Wheat',
    category: 'Grains',
    farmerId: 'f-1',
    farmerName: 'Sardar Ramesh Singh',
    farmerLocation: 'Ludhiana, Punjab',
    pricePerUnit: 2400,
    unit: 'Quintal',
    availableQuantity: 150,
    minOrderQuantity: 10,
    isOrganic: true,
    listingType: 'auction',
    currentHighestBid: 2450,
    totalBids: 14,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800'
  },
  {
    id: 'crop-102',
    title: 'Fresh Farm-Pick Tomatoes',
    category: 'Vegetables',
    farmerId: 'f-2',
    farmerName: 'Sunita Patil',
    farmerLocation: 'Nashik, Maharashtra',
    pricePerUnit: 1800,
    unit: 'Quintal',
    availableQuantity: 45,
    minOrderQuantity: 5,
    isOrganic: false,
    listingType: 'fixed',
    currentHighestBid: null,
    totalBids: 0,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'
  }
];

// @desc    Get all marketplace crops
// @route   GET /api/products
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Add new crop produce listing
// @route   POST /api/products
// @access  Private (Authenticated users / Farmers / Admin)
router.post('/', protect, (req, res) => {
  try {
    const { title, category, pricePerUnit, unit, availableQuantity, minOrderQuantity, isOrganic, listingType, image } = req.body;

    if (!title || !pricePerUnit) {
      return res.status(400).json({ success: false, message: 'Please provide crop title and price.' });
    }

    const newCrop = {
      id: `crop-${Date.now()}`,
      title,
      category: category || 'Grains',
      farmerId: req.user._id,
      farmerName: req.user.name || 'Verified Farmer',
      farmerLocation: req.user.location || 'India',
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'Quintal',
      availableQuantity: Number(availableQuantity) || 50,
      minOrderQuantity: Number(minOrderQuantity) || 5,
      isOrganic: Boolean(isOrganic),
      listingType: listingType || 'fixed',
      currentHighestBid: listingType === 'auction' ? Number(pricePerUnit) : null,
      totalBids: 0,
      image: image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800'
    };

    products.unshift(newCrop);
    res.status(201).json({ success: true, message: 'Produce listing created successfully', product: newCrop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Place bid on auction crop
// @route   POST /api/products/:id/bid
// @access  Private
router.post('/:id/bid', protect, (req, res) => {
  try {
    const { amount } = req.body;
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.listingType !== 'auction') {
      return res.status(400).json({ success: false, message: 'This item is fixed-price and does not accept bids' });
    }

    const currentBid = product.currentHighestBid || product.pricePerUnit;
    if (Number(amount) <= currentBid) {
      return res.status(400).json({ success: false, message: `Bid must exceed current price of Rs.${currentBid}` });
    }

    product.currentHighestBid = Number(amount);
    product.totalBids = (product.totalBids || 0) + 1;

    res.status(200).json({
      success: true,
      message: `Bid of Rs.${amount} placed successfully`,
      product
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Delete crop produce (Admin Only)
// @route   DELETE /api/products/:id
// @access  Private / Admin Only
router.delete('/:id', protect, adminOnly, (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Product deleted by Administrator' });
});

export default router;
