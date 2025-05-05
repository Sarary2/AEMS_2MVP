const fs = require('fs');
const csv = require('csv-parser');

// Event-level severity classifier
function classifySeverity(type = '', deviceProblem = '', patientProblem = '', eventText = '') {
  const input = `${type} ${deviceProblem} ${patientProblem} ${eventText}`.toLowerCase();

  const criticalKeywords = [
    'death', 'cpr', 'asystole', 'seizure', 'shock', 'loss of mechanical ventilation',
    'cardiac arrest', 'failure to ventilate', 'life-threatening', 'serious injury',
    'critical malfunction', 'bradycardia', 'emergency', 'over-sensing'
  ];

  const warningKeywords = [
    'malfunction', 'detachment', 'detached', 'unexpected shutdown', 'break', 'battery issue',
    'no output', 'failure', 'positioning failure', 'unable to', 'incorrect', 'inaccuracy',
    'noise', 'microbial contamination', 'leak'
  ];

  if (criticalKeywords.some(k => input.includes(k))) return 'Severe';
  if (warningKeywords.some(k => input.includes(k))) return 'Moderate';
  return 'Minor';
}

// Risk-based classification at device level
function classifyDeviceRiskWeighted(device) {
  const severityWeights = {
    Severe: 5,
    Moderate: 3,
    Minor: 1,
  };

  let totalScore = 0;
  let hasSevere = false;

  device.events.forEach(event => {
    const weight = severityWeights[event.severity] || 0;
    totalScore += weight;
    if (event.severity === 'Severe') hasSevere = true;
  });

  const avgSeverity = totalScore / device.events.length;

  if (totalScore >= 25 && hasSevere) return 'Critical';
  if (totalScore >= 10 || avgSeverity >= 2.5) return 'Warning';
  return 'Safe';
}

// CSV Parser
function parseFDAFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

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
          results.push({
            deviceName,
            model,
            eventType,
            description: deviceProblem,
            patientProblem,
            reportDate,
            manufacturer,
            severity: classifySeverity(eventType, deviceProblem, patientProblem, eventText),
          });
        }
      })
      .on('end', () => {
        console.log("✅ Total parsed events:", results.length);
        resolve(results);
      })
      .on('error', reject);
  });
}

module.exports = { parseFDAFile, classifyDeviceRiskWeighted };

