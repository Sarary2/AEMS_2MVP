// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { parseFDAFile } = require('./utils/parseFDA');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check endpoint
app.get('/', (req, res) => res.send('AEMS API is running 🚀'));

// ✅ Sample parse route (useful for debugging only)
app.get('/api/parse-fda', async (req, res) => {
  try {
    const samplePath = path.join(__dirname, 'uploads', 'maude.csv');
    const data = await parseFDAFile(samplePath);
    res.json(data.slice(0, 50));
  } catch (error) {
    console.error("❌ Error parsing FDA data:", error.message);
    res.status(500).json({ message: 'Error parsing FDA data' });
  }
});

// ✅ Main device API routes
app.use('/api/devices', deviceRoutes);

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aems';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
