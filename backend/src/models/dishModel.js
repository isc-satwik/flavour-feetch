const db = require('../config/db');

const getAllDishes = async () => {
  const [rows] = await db.query('SELECT * FROM dishes');
  return rows;
};

const getDishById = async (id) => {
  const [rows] = await db.query('SELECT * FROM dishes WHERE id = ?', [id]);
  return rows[0];
};

const createDish = async (name, description, image_url, default_servings) => {
  const [result] = await db.query(
    'INSERT INTO dishes (name, description, image_url, default_servings) VALUES (?, ?, ?, ?)',
    [name, description, image_url, default_servings]
  );
  return result.insertId;
};

const updateDish = async (id, name, description, image_url, default_servings) => {
  await db.query(
    'UPDATE dishes SET name = ?, description = ?, image_url = ?, default_servings = ? WHERE id = ?',
    [name, description, image_url, default_servings, id]
  );
};

const deleteDish = async (id) => {
  await db.query('DELETE FROM dishes WHERE id = ?', [id]);
};

const addIngredientToDish = async (dish_id, ingredient_id, quantity_per_serving) => {
  await db.query(
    'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_per_serving) VALUES (?, ?, ?)',
    [dish_id, ingredient_id, quantity_per_serving]
  );
};

const removeIngredientFromDish = async (dish_id, ingredient_id) => {
  await db.query(
    'DELETE FROM dish_ingredients WHERE dish_id = ? AND ingredient_id = ?',
    [dish_id, ingredient_id]
  );
};

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  addIngredientToDish,
  removeIngredientFromDish
}; 