const fs = require('fs');
const csv = require('csv-parser');
const Device = require('../models/Device');

function classifySeverity(text) {
  const lower = text.toLowerCase();

  if (lower.includes('death') || lower.includes('cardiac arrest') || lower.includes('life threatening')) {
    return 'Severe';
  }
  if (
    lower.includes('hospitalization') ||
    lower.includes('intervention') ||
    lower.includes('failure') ||
    lower.includes('malfunction') ||
    lower.includes('injury')
  ) {
    return 'Moderate';
  }
  return 'Minor';
}

function classifyDeviceStatus(events) {
  const total = events.length;
  let hasCriticalHarm = false;
  let hasModerateHarm = false;

  for (const e of events) {
    const text = `${e.description} ${e.patientProblem}`.toLowerCase();
    if (text.includes('death') || text.includes('cardiac arrest')) hasCriticalHarm = true;
    if (
      text.includes('injury') ||
      text.includes('hospitalization') ||
      text.includes('intervention')
    ) hasModerateHarm = true;
  }

  if (total >= 40 || hasCriticalHarm) return 'Critical';
  if (total >= 15 || hasModerateHarm) return 'Warning';
  return 'Safe';
}

function parseFDAFile(filePath) {
  return new Promise((resolve, reject) => {
    const rawEvents = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        const deviceName = row['Brand Name'];
        const model = row['Product Code'];
        const eventType = row['Event Type'];
        const deviceProblem = row['Device Problem'];
        const patientProblem = row['Patient Problem'];
        const reportDate = row['Date Received'];
        const manufacturer = row['Manufacturer'];
        const eventText = row['Event Text'];

        if (!deviceName || !model || !deviceProblem) return;

        const fullText = `${eventType} ${deviceProblem} ${patientProblem} ${eventText}`;
        const severity = classifySeverity(fullText);

        rawEvents.push({
          deviceName,
          model,
          manufacturer,
          eventType,
          description: deviceProblem,
          patientProblem,
          reportDate,
          severity
        });
      })
      .on('end', async () => {
        const deviceMap = new Map();

        for (const event of rawEvents) {
          const key = `${event.deviceName}-${event.model}`;
          if (!deviceMap.has(key)) {
            deviceMap.set(key, {
              deviceName: event.deviceName,
              model: event.model,
              manufacturer: event.manufacturer,
              events: []
            });
          }

          deviceMap.get(key).events.push({
            eventType: event.eventType,
            description: event.description,
            patientProblem: event.patientProblem,
            reportDate: event.reportDate,
            severity: event.severity
          });
        }

        const devices = Array.from(deviceMap.values());

        for (const device of devices) {
          device.status = classifyDeviceStatus(device.events);
          await Device.findOneAndUpdate(
            { deviceName: device.deviceName, model: device.model },
            device,
            { upsert: true, new: true }
          );
        }

        console.log(`✅ Final stored devices: ${devices.length}`);
        resolve(devices);
      })
      .on('error', reject);
  });
}

module.exports = { parseFDAFile };
