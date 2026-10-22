import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productTitle: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String },
  category: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'confirmed' },
  paymentMethod: { type: String, default: 'escrow' },
  date: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
