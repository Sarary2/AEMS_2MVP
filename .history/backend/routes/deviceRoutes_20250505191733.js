const express = require('express');
const router = express.Router();
const path = require('path');
const Device = require('../models/Device');
const { parseFDAFile } = require('../utils/parseFDA');

// POST /api/devices/upload
router.post('/upload', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'maude.csv');
    console.log("📄 Reading file from:", filePath);

    const events = await parseFDAFile(filePath);
    console.log("✅ Parsed Events Count:", events.length);

    if (!events.length) {
      console.warn("⚠️ No events found. Check CSV format or headers.");
      return res.status(400).json({ message: 'No events parsed. Check CSV format or headers.' });
    }

    console.log("🧪 Sample Event:", events[0]);

    const devicesMap = {};

    events.forEach(event => {
      const key = `${event.deviceName}-${event.model}`;
      if (!devicesMap[key]) {
        devicesMap[key] = {
          deviceName: event.deviceName,
          model: event.model,
          manufacturer: event.manufacturer,
          events: []
        };
      }

      devicesMap[key].events.push({
        description: event.description,
        patientProblem: event.patientProblem,
        eventType: event.eventType,
        reportDate: event.reportDate,
        severity: event.severity
      });
    });

    console.log("📦 Devices being stored:", Object.keys(devicesMap));

    for (const key in devicesMap) {
      const deviceData = devicesMap[key];
      await Device.findOneAndUpdate(
        { deviceName: deviceData.deviceName, model: deviceData.model },
        {
          $push: { events: { $each: deviceData.events } },
          manufacturer: deviceData.manufacturer
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: '✅ Data uploaded and processed successfully.' });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: 'Upload failed.' });
  }
});

// GET /api/devices?name=...&model=...
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
// GET /api/devices/all - List all device names and models
router.get('/all', async (req, res) => {
    try {
      const devices = await Device.find({}, { deviceName: 1, model: 1 }).limit(20);
      res.json(devices);
    } catch (err) {
      console.error("❌ Error fetching all devices:", err);
      res.status(500).json({ message: 'Error retrieving devices.' });
    }
  });
  
module.exports = router;

