const ingredientModel = require('../models/ingredientModel');

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await ingredientModel.getAllIngredients();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const ingredient = await ingredientModel.getIngredientById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createIngredient = async (req, res) => {
  const { name, unit } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ message: 'Name and unit are required.' });
  }
  try {
    const ingredientId = await ingredientModel.createIngredient(name, unit);
    res.status(201).json({ message: 'Ingredient created', ingredientId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateIngredient = async (req, res) => {
  const { name, unit } = req.body;
  try {
    await ingredientModel.updateIngredient(req.params.id, name, unit);
    res.json({ message: 'Ingredient updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    await ingredientModel.deleteIngredient(req.params.id);
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
}; 