const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
  res.send('Flavour Fetch backend is running!');
});

// Test DB connection
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('MySQL database connected successfully!');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 