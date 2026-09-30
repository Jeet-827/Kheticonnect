import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Grains' },
  farmerId: { type: String },
  farmerName: { type: String, default: 'Sardar Ramesh Singh' },
  farmerLocation: { type: String, default: 'Ludhiana, Punjab' },
  farmerRating: { type: Number, default: 4.9 },
  farmerReviewsCount: { type: Number, default: 35 },
  isVerifiedFarmer: { type: Boolean, default: true },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  availableQuantity: { type: Number, default: 100 },
  minOrderQuantity: { type: Number, default: 10 },
  harvestDate: { type: String, default: '2026-03-15' },
  isOrganic: { type: Boolean, default: true },
  listingType: { type: String, enum: ['auction', 'fixed'], default: 'fixed' },
  currentHighestBid: { type: Number },
  minBidIncrement: { type: Number, default: 50 },
  auctionEndsAt: { type: String },
  totalBids: { type: Number, default: 0 },
  bidsHistory: [{
    bidderName: String,
    amount: Number,
    time: String
  }],
  image: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
