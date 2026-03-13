require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor.cjs');

const MONGODB_URI = process.env.MONGODB_URI;

const sampleDoctors = [
  {
    name: 'Dr. Rajesh Kumar',
    qualification: 'MBBS, MD (General Medicine)',
    specialization: 'General Physician',
    address: 'Apollo Hospitals, Jubilee Hills, Hyderabad',
    phone: '+91 9876543210',
    fee: 500
  },
  {
    name: 'Dr. Priya Sharma',
    qualification: 'MBBS, MD (Cardiology)',
    specialization: 'Cardiologist',
    address: 'Care Hospitals, Banjara Hills, Hyderabad',
    phone: '+91 9876543211',
    fee: 800
  },
  {
    name: 'Dr. Anil Reddy',
    qualification: 'MBBS, MS (Orthopedics)',
    specialization: 'Orthopedic Surgeon',
    address: 'Yashoda Hospitals, Secunderabad',
    phone: '+91 9876543212',
    fee: 700
  }
];

async function addDoctors() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Add sample doctors
    await Doctor.insertMany(sampleDoctors);
    console.log('✅ Added sample doctors successfully!');

    const count = await Doctor.countDocuments();
    console.log(`Total doctors in database: ${count}`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error adding doctors:', error);
    process.exit(1);
  }
}

addDoctors();
