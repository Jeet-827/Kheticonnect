import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'Kheti Advisory Team' },
  summary: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  benefit: { type: String, required: true },
  eligibility: { type: String, required: true },
  linkText: { type: String, default: 'Learn More' }
}, { timestamps: true });

const threadSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorRole: { type: String, default: 'Farmer' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 },
  postedAt: { type: String, default: 'Just now' },
  replies: [{
    author: String,
    text: String,
    time: String
  }]
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String },
  cropTitle: { type: String, required: true },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true }
}, { timestamps: true });

export const Guide = mongoose.model('Guide', guideSchema);
export const Scheme = mongoose.model('Scheme', schemeSchema);
export const Thread = mongoose.model('Thread', threadSchema);
export const Review = mongoose.model('Review', reviewSchema);
