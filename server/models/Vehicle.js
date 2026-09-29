import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  vehicleType: { type: String, required: true },
  capacity:    { type: String, required: true },
  from:        { type: String, required: true },
  to:          { type: String, required: true },
  price:       { type: Number, required: true },
  priceUnit:   { type: String, default: 'trip' },
  eta:         { type: String, default: '4–6 hrs' },
  phone:       { type: String, default: '+91-90000-00000' },
  features:    { type: [String], default: ['GPS Tracked', 'Insured'] },
  badge:       { type: String, default: null },
  rating:      { type: Number, default: 5.0 },
  reviews:     { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
  avatar:      { type: String, default: 'truck' },
}, { timestamps: true });

export default mongoose.model('Vehicle', VehicleSchema);
