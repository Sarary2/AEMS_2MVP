const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { parseFDAFile } = require('./utils/parseFDA');
const deviceRoutes = require('./routes/deviceRoutes');
const app = express();
app.use(cors());
app.use(express.json());

// Test route to parse FDA MAUDE CSV
app.get('/api/parse-fda', async (req, res) => {
  try {
    const data = await parseFDAFile('./uploads/maude.csv');
    res.json(data.slice(0, 50)); // Show sample results
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error parsing FDA data' });
  }
});
app.use('/api/devices', deviceRoutes);  // this will now handle GET /api/devices
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
