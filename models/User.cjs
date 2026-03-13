const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for local auth
  avatar: { type: String },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  isAdmin: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
