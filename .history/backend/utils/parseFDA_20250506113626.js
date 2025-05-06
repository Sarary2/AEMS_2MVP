const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DEVICE_FILE = path.join(__dirname, '..', 'data', 'devices.json');

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function classifySeverity(text) {
  const t = text.toLowerCase();
  if (t.includes('death') || t.includes('cardiac arrest')) return 'Severe';
  if (t.includes('injury') || t.includes('malfunction') || t.includes('failure') || t.includes('intervention')) return 'Moderate';
  return 'Minor';
}

function classifyDeviceStatus(events) {
  let severeCount = 0;
  let hasDeath = false, hasInjury = false;

  for (const e of events) {
    const full = `${e.deviceProblem} ${e.patientProblem} ${e.eventText}`.toLowerCase();
    if (full.includes('death') || full.includes('cardiac arrest')) hasDeath = true;
    if (full.includes('injury') || full.includes('hospitalization') || full.includes('intervention')) hasInjury = true;
    if (e.severity === 'Severe') severeCount++;
  }

  const riskScore = (severeCount * 5) + events.length;
  if (hasDeath || riskScore >= 40) return 'Critical';
  if (hasInjury || riskScore >= 15) return 'Warning';
  return 'Safe';
}

async function parseFDAFile(filePath) {
  return new Promise((resolve, reject) => {
    const rawEvents = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        const brand = row['Brand Name']?.trim();
        const deviceProblem = row['Device Problem']?.trim();
        const patientProblem = row['Patient Problem']?.trim();
        const eventText = row['Event Text']?.trim();

        if (!brand || !deviceProblem) return;

        const severity = classifySeverity(`${deviceProblem} ${patientProblem} ${eventText}`);
        rawEvents.push({ brandName: brand, deviceProblem, patientProblem, eventText, severity });
      })
      .on('end', () => {
        const deviceMap = new Map();

        for (const event of rawEvents) {
          const key = event.brandName;
          if (!deviceMap.has(key)) {
            deviceMap.set(key, {
              brandName: event.brandName,
              events: []
            });
          }
          deviceMap.get(key).events.push({
            deviceProblem: event.deviceProblem,
            patientProblem: event.patientProblem,
            eventText: event.eventText,
            severity: event.severity
          });
        }

        const devices = Array.from(deviceMap.values()).map(device => {
          device.status = classifyDeviceStatus(device.events);
          return device;
        });

        ensureDirectoryExists(DEVICE_FILE);
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

