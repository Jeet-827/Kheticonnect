import express from 'express';
import { protect } from '../middleware/protect.js';
import Product from '../models/Product.js';

const router = express.Router();

// Helper to format product for frontend compatibility (map _id to id)
function formatProduct(p) {
  const doc = p.toObject ? p.toObject() : p;
  return {
    ...doc,
    id: doc.id || doc._id.toString(),
  };
}

// @desc    Get all marketplace crops
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const dbProducts = await Product.find().sort({ createdAt: -1 });
    const products = dbProducts.map(formatProduct);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Add new crop produce listing
// @route   POST /api/products
// @access  Private (Authenticated users / Farmers)
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, pricePerUnit, unit, availableQuantity, minOrderQuantity, isOrganic, listingType, image, description } = req.body;

    if (!title || !pricePerUnit) {
      return res.status(400).json({ success: false, message: 'Please provide crop title and price.' });
    }

    const newCrop = await Product.create({
      title,
      category: category || 'Grains',
      farmerId: req.user?._id ? req.user._id.toString() : (req.user?.id ? req.user.id.toString() : 'f-1'),
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
      image: image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
      description: description || 'Fresh farm produce directly listed by farmer.'
    });

    res.status(201).json({ success: true, message: 'Produce listing created successfully', product: formatProduct(newCrop) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Place bid on auction crop
// @route   POST /api/products/:id/bid
// @access  Private
router.post('/:id/bid', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      // Fallback search by legacy string id field if needed
      product = await Product.findOne({ id: req.params.id });
    }

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
    product.bidsHistory.unshift({
      bidderName: req.user.name || 'Verified Buyer',
      amount: Number(amount),
      time: 'Just now'
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: `Bid of Rs.${amount} placed successfully`,
      product: formatProduct(product)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Delete crop produce
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
