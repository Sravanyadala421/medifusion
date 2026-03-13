const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  fee: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  distance: { type: String, default: 'Local' },
  availability: { type: String, default: 'Available Today' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
