const db = require('../config/db');

const getAllIngredients = async () => {
  const [rows] = await db.query('SELECT * FROM ingredients');
  return rows;
};

const getIngredientById = async (id) => {
  const [rows] = await db.query('SELECT * FROM ingredients WHERE id = ?', [id]);
  return rows[0];
};

const createIngredient = async (name, unit) => {
  const [result] = await db.query(
    'INSERT INTO ingredients (name, unit) VALUES (?, ?)',
    [name, unit]
  );
  return result.insertId;
};

const updateIngredient = async (id, name, unit) => {
  await db.query(
    'UPDATE ingredients SET name = ?, unit = ? WHERE id = ?',
    [name, unit, id]
  );
};

const deleteIngredient = async (id) => {
  await db.query('DELETE FROM ingredients WHERE id = ?', [id]);
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
}; 