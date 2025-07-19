const db = require('../config/db');

const getFavoritesByUser = async (user_id) => {
  const [rows] = await db.query(
    `SELECT f.id, f.dish_id, d.name as dish_name, f.servings
     FROM favorites f
     JOIN dishes d ON f.dish_id = d.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [user_id]
  );
  return rows;
};

const addFavorite = async (user_id, dish_id, servings) => {
  await db.query(
    'INSERT IGNORE INTO favorites (user_id, dish_id, servings) VALUES (?, ?, ?)',
    [user_id, dish_id, servings]
  );
};

const removeFavorite = async (user_id, dish_id, servings) => {
  await db.query(
    'DELETE FROM favorites WHERE user_id = ? AND dish_id = ? AND servings = ?',
    [user_id, dish_id, servings]
  );
};

module.exports = { getFavoritesByUser, addFavorite, removeFavorite }; 