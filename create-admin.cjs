require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.cjs');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = 'sravanyadala7@gmail.com';
const ADMIN_PASSWORD = 'Sravan@123';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('IsAdmin:', existingAdmin.isAdmin);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = new User({
      name: 'Sravan Yadala',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      age: 25,
      weight: 70,
      height: 175,
      isAdmin: true,
      authProvider: 'local'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('You can now login with these credentials.');

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
