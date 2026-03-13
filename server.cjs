require('dotenv').config({ path: '.env.local' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor.cjs');
const User = require('./models/User.cjs');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = 'sravanyadala7@gmail.com';

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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, weight, height } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      height,
      isAdmin: email === ADMIN_EMAIL,
      authProvider: 'local'
    });

    await user.save();

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isAdmin: user.isAdmin,
      authProvider: user.authProvider
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google') {
      return res.status(400).json({ error: 'Please login with Google' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isAdmin: user.isAdmin,
      authProvider: user.authProvider,
      avatar: user.avatar
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name,
        email,
        avatar,
        isAdmin: email === ADMIN_EMAIL,
        authProvider: 'google'
      });
      await user.save();
    }

    // Return user
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isAdmin: user.isAdmin,
      authProvider: user.authProvider,
      avatar: user.avatar
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Routes (Protected)
app.post('/api/doctors', isAdmin, async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).send(doctor);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/admin/analytics', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const users = await User.find({}, 'name email createdAt');
    res.send({ totalUsers, totalDoctors, users });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/admin/analytics', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const users = await User.find({}, 'name email createdAt');
    res.send({ totalUsers, totalDoctors, users });
  } catch (err) {
    res.status(500).send(err);
  }
});

// User Routes
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    // Map to frontend format
    const formattedDoctors = doctors.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      specialization: doc.specialization,
      address: doc.address,
      phone: doc.phone,
      fee: doc.fee
    }));
    res.send(formattedDoctors);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/users', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = new User(req.body);
      await user.save();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
