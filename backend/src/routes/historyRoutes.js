const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');
const historyModel = require('../models/historyModel');

router.get('/', authMiddleware, historyController.getUserHistory);

// Add order to history (POST)
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { dish_id, servings_requested } = req.body;
  if (!dish_id || !servings_requested) {
    return res.status(400).json({ message: 'dish_id and servings_requested are required.' });
  }
  try {
    await historyModel.logHistory(userId, dish_id, servings_requested);
    res.status(201).json({ message: 'Order added to history.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 