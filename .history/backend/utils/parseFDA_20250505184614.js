const fs = require('fs');
const csv = require('csv-parser');

function parseFDAFile(filePath) {
  return new Promise((resolve, reject) => {
    const events = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Basic classification
        const severity = classifySeverity(row.event_type, row.event_description);
        events.push({ ...row, severity });
      })
      .on('end', () => resolve(events))
      .on('error', reject);
  });
}

function classifySeverity(type, description) {
  if (/death|serious/i.test(description)) return 'Severe';
  if (/malfunction|delay|minor/i.test(description)) return 'Moderate';
  return 'Minor';
}

module.exports = { parseFDAFile };
