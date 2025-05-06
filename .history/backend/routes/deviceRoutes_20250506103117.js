const express = require('express');
const router = express.Router();
const path = require('path');
const { parseFDAFile, getAllDevices } = require('../utils/parseFDA');

// Upload and parse MAUDE file
router.post('/upload', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'maude.csv');
    const devices = await parseFDAFile(filePath);
    res.json({ message: '✅ Data uploaded and processed successfully.', count: devices.length });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

// Return all processed devices
router.get('/all', (req, res) => {
  try {
    const devices = getAllDevices();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read devices.' });
  }
});

module.exports = router;
