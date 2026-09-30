import express from 'express';
import { protect } from '../middleware/protect.js';
import MandiRate from '../models/MandiRate.js';
import { Guide, Scheme, Thread, Review } from '../models/Community.js';

const router = express.Router();

function formatDoc(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    ...d,
    id: d.id || d._id.toString()
  };
}

// ─── Advisory Guides ─────────────────────────────────────────────────────────

// @route   GET /api/community/guides
router.get('/guides', async (req, res) => {
  try {
    const docs = await Guide.find().sort({ createdAt: -1 });
    const guides = docs.map(formatDoc);
    res.status(200).json({ success: true, count: guides.length, guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/community/guides
router.post('/guides', protect, async (req, res) => {
  try {
    const { title, category, readTime, author, summary, image } = req.body;
    if (!title || !category || !summary) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and summary.' });
    }

    const newGuide = await Guide.create({
      title,
      category,
      readTime: readTime || '5 min read',
      author: author || req.user.name || 'Kheti Advisory Team',
      summary,
      image: image || 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop'
    });

    res.status(201).json({ success: true, message: 'Advisory guide added successfully', guide: formatDoc(newGuide) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Government Schemes ───────────────────────────────────────────────────────

// @route   GET /api/community/schemes
router.get('/schemes', async (req, res) => {
  try {
    const docs = await Scheme.find().sort({ createdAt: -1 });
    const schemes = docs.map(formatDoc);
    res.status(200).json({ success: true, count: schemes.length, schemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Forum Threads ────────────────────────────────────────────────────────────

// @route   GET /api/community/forum
router.get('/forum', async (req, res) => {
  try {
    const docs = await Thread.find().sort({ createdAt: -1 });
    const threads = docs.map(formatDoc);
    res.status(200).json({ success: true, count: threads.length, threads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/community/forum
router.post('/forum', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newThread = await Thread.create({
      authorName: req.user.name || 'Anonymous Farmer',
      authorRole: req.user.role === 'farmer' ? 'Farmer' : req.user.role === 'buyer' ? 'Buyer / Trader' : 'Community Member',
      title,
      content,
      likes: 0,
      repliesCount: 0,
      postedAt: 'Just now',
      replies: []
    });

    res.status(201).json({ success: true, message: 'Question posted successfully', thread: formatDoc(newThread) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/community/forum/:id/reply
router.post('/forum/:id/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Reply text is required.' });

    let thread = await Thread.findById(req.params.id);
    if (!thread) {
      thread = await Thread.findOne({ id: req.params.id });
    }

    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found.' });

    const reply = { author: req.user.name || 'Anonymous', text, time: 'Just now' };
    thread.replies.push(reply);
    thread.repliesCount = thread.replies.length;

    await thread.save();

    res.status(201).json({ success: true, message: 'Reply added', reply, thread: formatDoc(thread) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Mandi Rates ─────────────────────────────────────────────────────────────

// @route   GET /api/community/mandi
router.get('/mandi', async (req, res) => {
  try {
    const docs = await MandiRate.find().sort({ createdAt: -1 });
    const mandiRates = docs.map(formatDoc);
    res.status(200).json({ success: true, count: mandiRates.length, mandiRates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

// @route   GET /api/community/reviews
router.get('/reviews', async (req, res) => {
  try {
    const docs = await Review.find().sort({ createdAt: -1 });
    const reviews = docs.map(formatDoc);
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/community/reviews
router.post('/reviews', protect, async (req, res) => {
  try {
    const { cropTitle, rating, comment } = req.body;
    if (!cropTitle || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'cropTitle, rating, and comment are required.' });
    }

    const newReview = await Review.create({
      buyerName: req.user.name || 'Verified Buyer',
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      cropTitle,
      comment,
      verifiedPurchase: true
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review: formatDoc(newReview) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
