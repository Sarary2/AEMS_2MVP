const fs = require('fs');
const csv = require('csv-parser');
const Device = require('../models/Device');

// Classify individual event severity
function classifySeverity(eventType, deviceProblem, patientProblem, eventText) {
  const text = `${eventType} ${deviceProblem} ${patientProblem} ${eventText}`.toLowerCase();

  if (
    text.includes('death') ||
    text.includes('cardiac arrest') ||
    text.includes('serious injury') ||
    text.includes('life threatening')
  ) {
    return 'Severe';
  } else if (
    text.includes('hospitalization') ||
    text.includes('intervention') ||
    text.includes('failure') ||
    text.includes('malfunction')
  ) {
    return 'Moderate';
  } else {
    return 'Minor';
  }
}

// Classify overall device status based on event profile
function classifyDeviceStatus(events) {
  const total = events.length;
  let severeCount = 0;
  let moderateCount = 0;

  for (const event of events) {
    if (event.severity === 'Severe') severeCount++;
    else if (event.severity === 'Moderate') moderateCount++;
  }

  const severePct = (severeCount / total) * 100;
  const moderatePct = (moderateCount / total) * 100;

  if (severePct >= 20) return 'Critical';
  if (moderatePct >= 20) return 'Warning';
  return 'Safe';
}

// Main parser and importer
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

        if (deviceName && model) {
          const severity = classifySeverity(eventType, deviceProblem, patientProblem, eventText);
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
        }
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

        console.log(`✅ Parsed and classified ${devices.length} devices.`);
        resolve(devices);
      })
      .on('error', reject);
  });
}

module.exports = { parseFDAFile };
