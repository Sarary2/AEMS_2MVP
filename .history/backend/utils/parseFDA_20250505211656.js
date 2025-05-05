const fs = require('fs');
const csv = require('csv-parser');
const Device = require('../models/Device');

function classifySeverity(eventType, deviceProblem, patientProblem, eventText) {
  const text = `${eventType} ${deviceProblem} ${patientProblem} ${eventText}`.toLowerCase();

  if (text.includes('death') || text.includes('cardiac arrest') || text.includes('serious injury') || text.includes('life threatening')) {
    return 'Severe';
  } else if (text.includes('hospitalization') || text.includes('intervention') || text.includes('failure') || text.includes('malfunction') || text.includes('injury')) {
    return 'Moderate';
  } else {
    return 'Minor';
  }
}

function classifyDeviceStatus(events) {
  let severe = 0, moderate = 0, minor = 0;
  let hasDeath = false, hasInjury = false;
  const total = events.length;

  for (const e of events) {
    if (e.severity === 'Severe') severe++;
    else if (e.severity === 'Moderate') moderate++;
    else minor++;

    const text = `${e.description} ${e.patientProblem}`.toLowerCase();
    if (text.includes('death') || text.includes('cardiac arrest')) hasDeath = true;
    if (text.includes('injury') || text.includes('hospitalization') || text.includes('intervention')) hasInjury = true;
  }

  const riskScore = (severe * 5) + (moderate * 3) + (minor * 1);
  const freqStatus = riskScore >= 40 ? 'Critical' : riskScore >= 15 ? 'Warning' : 'Safe';
  const harmStatus = hasDeath ? 'Critical' : hasInjury ? 'Warning' : 'Safe';

  return { freqStatus, harmStatus };
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

        // ⛔️ Skip if any critical field is missing
        if (!deviceName || !model || !deviceProblem) return;

        const severity = classifySeverity(eventType, deviceProblem, patientProblem, eventText);

        rawEvents.push({
          deviceName,
          model,
          manufacturer,
          eventType,
          description: deviceProblem,
          patientProblem,
          reportDate,
          eventText,
          severity
        });
      })
      .on('end', async () => {
        console.log(`📊 Total rows read: ${rawEvents.length}`);
      
        if (rawEvents.length === 0) {
          console.warn("⚠️ No valid rows found. Likely missing expected columns.");
          return resolve([]);  // Early exit
        }
      
        const deviceMap = new Map();
        if (!deviceName || !model || !deviceProblem) {
            console.warn("❌ Skipping row - missing required fields", { deviceName, model, deviceProblem });
            return;
          }
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
          const { freqStatus, harmStatus } = classifyDeviceStatus(device.events);
          device.status = freqStatus;
          device.harmStatus = harmStatus;

          await Device.findOneAndUpdate(
            { deviceName: device.deviceName, model: device.model },
            device,
            { upsert: true, new: true }
          );
        }

        console.log(`✅ Parsed and saved ${devices.length} devices.`);
        resolve(devices);
      })
      .on('error', reject);
  });
}

module.exports = { parseFDAFile };
