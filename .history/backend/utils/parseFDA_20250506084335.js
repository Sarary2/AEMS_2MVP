const fs = require('fs');
const csv = require('csv-parser');
const Device = require('../models/Device');

// Severity classification using cumulative event context
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

// Smart risk classification combining event count & harm context
function classifyDeviceStatus(events) {
  const total = events.length;
  let severe = 0, moderate = 0, minor = 0;
  let hasCriticalHarm = false, hasModerateHarm = false;

  for (const e of events) {
    if (e.severity === 'Severe') severe++;
    else if (e.severity === 'Moderate') moderate++;
    else minor++;

    const harmText = `${e.description} ${e.patientProblem}`.toLowerCase();
    if (harmText.includes('death') || harmText.includes('cardiac arrest')) hasCriticalHarm = true;
    if (harmText.includes('injury') || harmText.includes('hospitalization') || harmText.includes('intervention')) {
      hasModerateHarm = true;
    }
  }

  const severityScore = severe * 5 + moderate * 3 + minor * 1;
  const harmScore = hasCriticalHarm ? 15 : hasModerateHarm ? 8 : 0;
  const totalScore = severityScore + harmScore;

  if (totalScore >= 50 || hasCriticalHarm || total >= 50) return 'Critical';
  if (totalScore >= 20 || hasModerateHarm || total >= 15) return 'Warning';
  return 'Safe';
}

// CSV Parsing and Classification Pipeline
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
          severity,
        });
      })
      .on('end', async () => {
        console.log(`📥 Parsed ${rawEvents.length} raw events`);

        const deviceMap = new Map();

        for (const event of rawEvents) {
          const key = `${event.deviceName}-${event.model}`;
          if (!deviceMap.has(key)) {
            deviceMap.set(key, {
              deviceName: event.deviceName,
              model: event.model,
              manufacturer: event.manufacturer,
              events: [],
            });
          }

          deviceMap.get(key).events.push({
            eventType: event.eventType,
            description: event.description,
            patientProblem: event.patientProblem,
            reportDate: event.reportDate,
            severity: event.severity,
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

        console.log(`✅ Stored ${devices.length} classified devices.`);
        resolve(devices);
      })
      .on('error', (err) => {
        console.error("❌ Error parsing CSV:", err);
        reject(err);
      });
  });
}

module.exports = { parseFDAFile };
