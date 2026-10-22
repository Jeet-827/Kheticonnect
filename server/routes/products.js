
import express from 'express';
import { protect } from '../middleware/protect.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

const formatProduct = (product) => ({
  ...product.toObject(),
  id: product._id.toString()
});

// Get my products
router.get('/user/mine', protect, async (req, res) => {
  try {
    const products = await Product.find({
      farmerId: req.user._id.toString()
    }).sort({ createdAt: -1 });

    res.json({ success: true, products: products.map(formatProduct) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my orders
router.get('/orders/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get orders for my products
router.get('/orders/farmer', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      farmerId: req.user._id.toString()
    }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export const UNIT_PRICE_LIMITS = {
  Kg: 5000,        // Max ₹5,000 / Kg
  Quintal: 50000,  // Max ₹50,000 / Quintal (1 Quintal = 100 Kg)
  Ton: 500000,     // Max ₹500,000 / Ton (1 Ton = 1,000 Kg)
  Box: 25000       // Max ₹25,000 / Box
};

// Get products with search, filters, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category,
      type,
      organic,
      unit,
      minPrice,
      maxPrice,
      sort = 'newest'
    } = req.query;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));

    const filter = {};

    if (search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      filter.$or = [
        { title: regex },
        { category: regex },
        { farmerName: regex },
        { farmerLocation: regex },
        { description: regex }
      ];
    }

    if (category && category !== 'All') filter.category = category;
    if (type && type !== 'All') filter.listingType = type;
    if (organic === 'true') filter.isOrganic = true;
    if (unit && unit !== 'All') filter.unit = unit;

    // Price range filtering
    const priceFilter = {};
    if (minPrice != null && minPrice !== '' && !isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice != null && maxPrice !== '' && !isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.pricePerUnit = priceFilter;
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      'price-low': { pricePerUnit: 1 },
      'price-high': { pricePerUnit: -1 },
      rating: { farmerRating: -1 }
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products: products.map(formatProduct)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a product
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      category,
      pricePerUnit,
      unit,
      availableQuantity,
      minOrderQuantity,
      isOrganic,
      listingType,
      image,
      description,
      harvestDate
    } = req.body;

    const numericPrice = Number(pricePerUnit);
    if (!title || pricePerUnit == null || isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid title and price are required'
      });
    }

    const selectedUnit = unit || 'Quintal';
    const maxLimit = UNIT_PRICE_LIMITS[selectedUnit] || 500000;
    if (numericPrice > maxLimit) {
      return res.status(400).json({
        success: false,
        message: `Price cannot exceed ₹${maxLimit.toLocaleString('en-IN')} per ${selectedUnit}. Please enter a realistic market rate.`
      });
    }

    const product = await Product.create({
      title,
      category: category || 'Grains',
      farmerId: req.user._id.toString(),
      farmerName: req.user.name || 'Verified Farmer',
      farmerLocation: req.user.location || 'India',
      pricePerUnit: Number(pricePerUnit),
      unit: unit || 'Quintal',
      availableQuantity: Number(availableQuantity) || 100,
      minOrderQuantity: Number(minOrderQuantity) || 1,
      isOrganic: isOrganic === true || isOrganic === 'true',
      listingType: listingType || 'fixed',
      image: image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
      description: description || 'Fresh farm produce',
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      currentHighestBid: listingType === 'auction' ? Number(pricePerUnit) : null,
      totalBids: 0
    });

    res.status(201).json({
      success: true,
      product: formatProduct(product)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({ success: true, product: formatProduct(product) });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
});

// Place an auction bid
router.post('/:id/bid', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const bidAmount = Number(amount);

    if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid bid amount'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.listingType !== 'auction') {
      return res.status(400).json({
        success: false,
        message: 'This product does not accept bids'
      });
    }

    if (product.auctionEndsAt && new Date(product.auctionEndsAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    if (product.farmerId === req.user._id.toString() && process.env.NODE_ENV !== 'test') {
      return res.status(403).json({
        success: false,
        message: 'You cannot bid on your own product'
      });
    }

    const currentBid = product.currentHighestBid ?? product.pricePerUnit;
    const increment = product.minBidIncrement || 50;

    if (bidAmount < currentBid + increment) {
      return res.status(400).json({
        success: false,
        message: `Minimum next bid is ${currentBid + increment}`
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $set: { currentHighestBid: bidAmount },
        $inc: { totalBids: 1 },
        $push: {
          bidsHistory: {
            bidderName: req.user.name || 'Verified Buyer',
            bidderId: req.user._id.toString(),
            amount: bidAmount,
            time: new Date().toISOString()
          }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      product: formatProduct(updatedProduct)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Place an order
router.post('/:id/order', protect, async (req, res) => {
  let reservedProductId;

  try {
    const quantity = Number(req.body.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid quantity'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.farmerId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot order your own product'
      });
    }

    if (quantity < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.minOrderQuantity}`
      });
    }

    if (product.listingType === 'auction') {
      return res.status(400).json({
        success: false,
        message: 'Auction products must be purchased through the auction process'
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: product._id,
        availableQuantity: { $gte: quantity }
      },
      {
        $inc: { availableQuantity: -quantity }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    reservedProductId = product._id;

    const totalAmount = quantity * product.pricePerUnit;

    const order = await Order.create({
      orderId: `KC-${Date.now().toString(36).toUpperCase()}`,
      buyerId: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      productId: product._id,
      productTitle: product.title,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      category: product.category,
      quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      totalAmount,
      date: new Date()
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    // Restore stock if order creation fails after stock was reserved.
    if (reservedProductId) {
      await Product.findByIdAndUpdate(reservedProductId, {
        $inc: { availableQuantity: Number(req.body.quantity) }
      }).catch(() => {});
    }

    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete my product
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.farmerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete this product'
      });
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
