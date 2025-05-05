const fs = require('fs');
const csv = require('csv-parser');

function classifySeverity(type, description) {
    const desc = description.toLowerCase();
    if (desc.includes('death') || desc.includes('life-threatening')) return 'Severe';
    if (desc.includes('malfunction') || desc.includes('injury')) return 'Moderate';
    return 'Minor';
  }
  
  function parseFDAFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.device_name && row.device_model) {
            const event = {
              deviceName: row.device_name,
              model: row.device_model,
              description: row.event_description || '',
              eventType: row.event_type || '',
              reportDate: row.date_received || '',
              severity: classifySeverity(row.event_type, row.event_description || '')
            };
            results.push(event);
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
  
  module.exports = { parseFDAFile };
