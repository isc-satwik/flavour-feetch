const dishModel = require('../models/dishModel');
const db = require('../config/db');
const historyModel = require('../models/historyModel');

const getAllDishes = async (req, res) => {
  try {
    const dishes = await dishModel.getAllDishes();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await dishModel.getDishById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createDish = async (req, res) => {
  const { name, description, image_url, default_servings } = req.body;
  if (!name || !default_servings) {
    return res.status(400).json({ message: 'Name and default_servings are required.' });
  }
  try {
    const dishId = await dishModel.createDish(name, description, image_url, default_servings);
    res.status(201).json({ message: 'Dish created', dishId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateDish = async (req, res) => {
  const { name, description, image_url, default_servings } = req.body;
  try {
    await dishModel.updateDish(req.params.id, name, description, image_url, default_servings);
    res.json({ message: 'Dish updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    await dishModel.deleteDish(req.params.id);
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addIngredientToDish = async (req, res) => {
  const { ingredient_id, quantity_per_serving } = req.body;
  try {
    await dishModel.addIngredientToDish(req.params.id, ingredient_id, quantity_per_serving);
    res.json({ message: 'Ingredient added to dish' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeIngredientFromDish = async (req, res) => {
  const { ingredient_id } = req.body;
  try {
    await dishModel.removeIngredientFromDish(req.params.id, ingredient_id);
    res.json({ message: 'Ingredient removed from dish' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getScaledIngredients = async (req, res) => {
  const dishId = req.params.id;
  const servings = parseInt(req.query.servings, 10);
  if (!servings || servings <= 0) {
    return res.status(400).json({ message: 'Valid servings query parameter required.' });
  }
  try {
    // Get default servings for the dish
    const [dishRows] = await db.query('SELECT default_servings FROM dishes WHERE id = ?', [dishId]);
    if (!dishRows.length) return res.status(404).json({ message: 'Dish not found' });
    const defaultServings = dishRows[0].default_servings;
    // Get ingredients and scale
    const [rows] = await db.query(`
      SELECT i.name, i.unit, di.quantity_per_serving
      FROM dish_ingredients di
      JOIN ingredients i ON di.ingredient_id = i.id
      WHERE di.dish_id = ?
    `, [dishId]);
    const scaledIngredients = rows.map(row => ({
      name: row.name,
      unit: row.unit,
      quantity: row.quantity_per_serving * servings
    }));
    // Log history if user is authenticated
    if (req.user && req.user.userId) {
      await historyModel.logHistory(req.user.userId, dishId, servings);
    }
    res.json({ dishId, servings, ingredients: scaledIngredients });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  addIngredientToDish,
  removeIngredientFromDish,
  getScaledIngredients
}; 