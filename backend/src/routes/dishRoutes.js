const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.post('/', dishController.createDish);
router.put('/:id', dishController.updateDish);
router.delete('/:id', dishController.deleteDish);

// Ingredient management for a dish
router.post('/:id/ingredients', dishController.addIngredientToDish);
router.delete('/:id/ingredients', dishController.removeIngredientFromDish);
router.get('/:id/ingredients/scaled', authMiddleware, dishController.getScaledIngredients);

module.exports = router; 