import mongoose from 'mongoose';

const mandiRateSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  change: { type: String, default: '+0.0%' }
}, {
  timestamps: true
});

export default mongoose.model('MandiRate', mandiRateSchema);
