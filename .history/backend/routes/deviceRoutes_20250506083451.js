const express = require('express');
const router = express.Router();
const path = require('path');
const { parseFDAFile } = require('../utils/parseFDA');
const Device = require('../models/Device');

// POST /api/devices/upload
router.post('/upload', async (req, res) => {
    try {
      const filePath = path.join(__dirname, '..', 'uploads', 'maude.csv');
      console.log("📂 Upload triggered. Reading file:", filePath);
  
      const devices = await parseFDAFile(filePath);
      console.log("✅ Devices parsed:", devices.length);
      console.log("🧪 Sample Device:", devices[0]);
  
      await Device.deleteMany({});
      console.log("🧹 Cleared old devices");
  
      await Device.insertMany(devices);
      console.log("✅ Inserted new devices");
  
      res.json({ message: "✅ Data uploaded and processed successfully." });
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      console.error(err.stack);
      res.status(500).json({ message: "Server error during upload." });
    }
  });

// GET /api/devices
router.get('/', async (req, res) => {
  const { name, model } = req.query;

  if (!name || !model) {
    return res.status(400).json({ message: 'Device name and model are required.' });
  }

  try {
    const device = await Device.findOne({
      deviceName: new RegExp(name, 'i'),
      model: new RegExp(model, 'i')
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.json(device);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: 'Error fetching device data.' });
  }
});

// GET /api/devices/all
router.get('/all', async (req, res) => {
    try {
      const devices = await Device.find({}, {
        deviceName: 1,
        model: 1,
        status: 1,
        manufacturer: 1,
        events: 1
      });
  
      res.json(devices);
    } catch (err) {
      console.error("❌ Error fetching all devices:", err);
      res.status(500).json({ message: 'Error retrieving devices.' });
    }
  });
  

module.exports = router;
