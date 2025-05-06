ix (Replace in parseFDA.js):

Modify the block before writing devices.json:

const fs = require('fs');
const path = require('path');
const DEVICE_FILE = path.join(__dirname, '..', 'data', 'devices.json');

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

Now inside your .on('end', () => { block, before fs.writeFileSync(...), add:

ensureDirectoryExists(DEVICE_FILE);
fs.writeFileSync(DEVICE_FILE, JSON.stringify(devices, null, 2));
