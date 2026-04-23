require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import models
const Doctor = require('../models/Doctor.cjs');
const User = require('../models/User.cjs');

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = 'sravanyadala7@gmail.com';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware to check admin
const isAdmin = async (req, res, next) => {
  const { email } = req.body;
  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, age, weight, height, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      age,
      weight,
      height,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user._id, fullName: user.fullName, email: user.email, age: user.age, weight: user.weight, height: user.height }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      message: 'Login successful',
      user: { id: user._id, fullName: user.fullName, email: user.email, age: user.age, weight: user.weight, height: user.height }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/doctors', isAdmin, async (req, res) => {
  try {
    const { name, qualification, specialization, address, phone, fee } = req.body;
    
    const doctor = new Doctor({
      name,
      qualification,
      specialization,
      address,
      phone,
      fee
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/doctors/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
module.exports = app;