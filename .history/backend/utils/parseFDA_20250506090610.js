const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const DEVICE_FILE = path.join(__dirname, '..', 'data', 'devices.json');

function classifySeverity(text) {
  const lower = text.toLowerCase();
  if (lower.includes('death') || lower.includes('cardiac arrest')) return 'Severe';
  if (lower.includes('injury') || lower.includes('malfunction') || lower.includes('failure')) return 'Moderate';
  return 'Minor';
}

function classifyDeviceStatus(events) {
  const total = events.length;
  let hasDeath = false, hasInjury = false;

  events.forEach(e => {
    const text = `${e.description} ${e.patientProblem}`.toLowerCase();
    if (text.includes('death') || text.includes('cardiac arrest')) hasDeath = true;
    if (text.includes('injury') || text.includes('hospitalization')) hasInjury = true;
  });

  if (total >= 40 || hasDeath) return 'Critical';
  if (total >= 15 || hasInjury) return 'Warning';
  return 'Safe';
}

async function parseFDAFile(filePath) {
  const rawEvents = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
      .on('data', row => {
        const deviceName = row['Brand Name'];
        const model = row['Product Code'];
        const deviceProblem = row['Device Problem'];
        const patientProblem = row['Patient Problem'];
        const eventType = row['Event Type'];
        const reportDate = row['Date Received'];
        const manufacturer = row['Manufacturer'];
        const eventText = row['Event Text'];

        if (!deviceName || !model || !deviceProblem) return;

        const severity = classifySeverity(`${eventType} ${deviceProblem} ${patientProblem} ${eventText}`);
        rawEvents.push({ deviceName, model, manufacturer, eventType, description: deviceProblem, patientProblem, reportDate, severity });
      })
      .on('end', () => {
        const deviceMap = new Map();
        rawEvents.forEach(event => {
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
        });

        const devices = Array.from(deviceMap.values());
        devices.forEach(device => {
          device.status = classifyDeviceStatus(device.events);
        });

        fs.writeFileSync(DEVICE_FILE, JSON.stringify(devices, null, 2));
        resolve(devices);
      })
      .on('error', reject);
  });
}

function getAllDevices() {
  const file = fs.readFileSync(DEVICE_FILE, 'utf-8');
  return JSON.parse(file);
}

module.exports = { parseFDAFile, getAllDevices };
