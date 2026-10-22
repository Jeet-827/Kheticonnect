
import express from 'express';
import { protect } from '../middleware/protect.js';
import MandiRate from '../models/MandiRate.js';
import { Guide, Scheme, Thread, Review } from '../models/Community.js';

const router = express.Router();

// Format MongoDB document
const formatDoc = (doc) => ({
  ...doc.toObject(),
  id: doc._id.toString()
});

// Get advisory guides
router.get('/guides', async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: guides.length,
      guides: guides.map(formatDoc)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add advisory guide
router.post('/guides', protect, async (req, res) => {
  try {
    const { title, category, readTime, author, summary, image } = req.body;

    if (!title || !category || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and summary are required'
      });
    }

    const guide = await Guide.create({
      title,
      category,
      readTime,
      author: author || req.user.name,
      summary,
      image
    });

    res.status(201).json({
      success: true,
      guide: formatDoc(guide)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get government schemes
router.get('/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: schemes.length,
      schemes: schemes.map(formatDoc)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get forum threads
router.get('/forum', async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: threads.length,
      threads: threads.map(formatDoc)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create forum thread
router.post('/forum', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const thread = await Thread.create({
      authorName: req.user.name,
      authorRole: req.user.role,
      title,
      content,
      replies: [],
      repliesCount: 0,
      likes: 0
    });

    res.status(201).json({
      success: true,
      thread: formatDoc(thread)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reply to a forum thread
router.post('/forum/:id/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Reply text is required'
      });
    }

    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    const reply = {
      author: req.user.name,
      text,
      time: new Date()
    };

    thread.replies.push(reply);
    thread.repliesCount = thread.replies.length;

    await thread.save();

    res.status(201).json({
      success: true,
      reply,
      thread: formatDoc(thread)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get mandi rates
router.get('/mandi', async (req, res) => {
  try {
    const mandiRates = await MandiRate.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: mandiRates.length,
      mandiRates: mandiRates.map(formatDoc)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews.map(formatDoc)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add review
router.post('/reviews', protect, async (req, res) => {
  try {
    const { cropTitle, rating, comment } = req.body;

    if (!cropTitle || rating == null || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Crop title, rating, and comment are required'
      });
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = await Review.create({
      buyerName: req.user.name,
      cropTitle,
      rating: Number(rating),
      comment,
      verifiedPurchase: true
    });

    res.status(201).json({
      success: true,
      review: formatDoc(review)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
