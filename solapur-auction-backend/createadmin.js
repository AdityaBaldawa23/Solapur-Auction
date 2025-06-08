// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Models/AdminUser');

const MONGO_URI = 'mongodb+srv://adityabaldawa23:Ab23m1b05@auction.0jrlycg.mongodb.net/Auction?retryWrites=true&w=majority&appName=Auction';

// Connect with proper options
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', async () => {
  console.log('✅ MongoDB connected');

  try {
    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('⚠️ Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({ username: 'admin', password: hashedPassword });
      await admin.save();
      console.log('✅ Admin created successfully');
    }
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    mongoose.disconnect();
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
