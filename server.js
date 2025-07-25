const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', {
  dbName: 'event_registration',
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => console.error('MongoDB Error:', err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  photo: Buffer, // store photo as binary
  photoType: String
});

const User = mongoose.model('User', userSchema);

// Multer config
const storage = multer.memoryStorage(); // no file system usage
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/submit', upload.single('photo'), async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Check if phone already registered
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const user = new User({
      name,
      phone,
      photo: req.file.buffer,
      photoType: req.file.mimetype
    });

    await user.save();
    res.status(200).json({ message: 'Registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
