const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const DEVICE_FILE = path.join(__dirname, '..', 'data', 'devices.json');

function classifySeverity(text) {
  const lower = text.toLowerCase();
  if (lower.includes('death') || lower.includes('cardiac arrest') || lower.includes('life threatening')) return 'Severe';
  if (lower.includes('injury') || lower.includes('hospitalization') || lower.includes('failure') || lower.includes('malfunction')) return 'Moderate';
  return 'Minor';
}

function classifyDeviceStatus(events) {
  const total = events.length;
  let hasDeath = false, hasInjury = false;

  for (const e of events) {
    const text = `${e.description} ${e.patientProblem}`.toLowerCase();
    if (text.includes('death') || text.includes('cardiac arrest')) hasDeath = true;
    if (text.includes('injury') || text.includes('hospitalization') || text.includes('intervention')) hasInjury = true;
  }

  if (total >= 40 || hasDeath) return 'Critical';
  if (total >= 15 || hasInjury) return 'Warning';
  return 'Safe';
}

async function parseFDAFile(filePath) {
  const rawEvents = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({
        separator: ';',
        mapHeaders: ({ header, index }) => index === 0 ? null : header.trim()
      }))
      .on('data', row => {
        const deviceName = row['Brand Name'];
        const model = row['Product Code'];
        const eventType = row['Event Type'];
        const deviceProblem = row['Device Problem'];
        const patientProblem = row['Patient Problem'];
        const reportDate = row['Date Received'];
        const manufacturer = row['Manufacturer'];
        const eventText = row['Event Text'];

        if (!deviceName || !model || !deviceProblem) return;

        const severity = classifySeverity(`${eventType} ${deviceProblem} ${patientProblem} ${eventText}`);
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

        const devices = Array.from(deviceMap.values()).map(device => {
          device.status = classifyDeviceStatus(device.events);
          return device;
        });

        fs.writeFileSync(DEVICE_FILE, JSON.stringify(devices, null, 2));
        console.log(`✅ Stored ${devices.length} classified devices.`);
        resolve(devices);
      })
      .on('error', reject);
  });
}

function getAllDevices() {
  if (!fs.existsSync(DEVICE_FILE)) return [];
  const file = fs.readFileSync(DEVICE_FILE, 'utf-8');
  return JSON.parse(file);
}

module.exports = { parseFDAFile, getAllDevices };
