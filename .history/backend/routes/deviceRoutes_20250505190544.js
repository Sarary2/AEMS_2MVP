const express = require('express');
const router = express.Router();
const path = require('path');
const Device = require('../models/Device');
const { parseFDAFile } = require('../utils/parseFDA');

// POST /api/devices/upload - Parse CSV and store in MongoDB
router.post('/upload', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'maude.csv');
    const events = await parseFDAFile(filePath);

    console.log("Parsed Events:", events.slice(0, 5));  // Debug print

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

    console.log("Devices being stored:", Object.keys(devicesMap));  // Debug print

    for (const key in devicesMap) {
      const deviceData = devicesMap[key];
      await Device.findOneAndUpdate(
        { deviceName: deviceData.deviceName, model: deviceData.model },
        { $push: { events: { $each: deviceData.events } }, manufacturer: deviceData.manufacturer },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Data uploaded and processed successfully.' });
  } catch (err) {
    console.error("Upload error:", err);
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
    if (!device) return res.status(404).json({ message: 'Device not found.' });
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching device data.' });
  }
});

module.exports = router;
