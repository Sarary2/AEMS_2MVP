const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET /api/devices?name=...&model=...
router.get('/', async (req, res) => {
  const { name, model } = req.query;

  if (!name || !model) {
    return res.status(400).json({ message: 'Device name and model are required.' });
  }

  try {
    const device = await Device.findOne({ deviceName: name, model });
    if (!device) return res.status(404).json({ message: 'Device not found.' });
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching device data.' });
  }
});

module.exports = router;
