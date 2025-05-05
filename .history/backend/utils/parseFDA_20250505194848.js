const fs = require('fs');
const csv = require('csv-parser');

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

        // Optional debug: log each row's keys
        // console.log("Parsed row keys:", Object.keys(row));

        if (deviceName && model && eventType && deviceProblem) {
          results.push({
            deviceName,
            model,
            eventType,
            description: deviceProblem,
            patientProblem,
            reportDate,
            manufacturer,
            severity: classifySeverity(eventType, deviceProblem, patientProblem)
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { parseFDAFile };
