const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const favoriteModel = require('../models/favoriteModel');

// Get all favorites for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const favorites = await favoriteModel.getFavoritesByUser(req.user.userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a favorite
router.post('/', authMiddleware, async (req, res) => {
  const { dish_id, servings } = req.body;
  if (!dish_id || !servings) {
    return res.status(400).json({ message: 'dish_id and servings are required.' });
  }
  try {
    await favoriteModel.addFavorite(req.user.userId, dish_id, servings);
    res.status(201).json({ message: 'Favorite added.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove a favorite
router.delete('/', authMiddleware, async (req, res) => {
  const { dish_id, servings } = req.body;
  if (!dish_id || !servings) {
    return res.status(400).json({ message: 'dish_id and servings are required.' });
  }
  try {
    await favoriteModel.removeFavorite(req.user.userId, dish_id, servings);
    res.json({ message: 'Favorite removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 