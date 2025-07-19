const db = require('../config/db');

const logHistory = async (user_id, dish_id, servings_requested) => {
  await db.query(
    'INSERT INTO user_history (user_id, dish_id, servings_requested) VALUES (?, ?, ?)',
    [user_id, dish_id, servings_requested]
  );
};

const getUserHistory = async (user_id) => {
  const [rows] = await db.query(
    `SELECT uh.id, uh.dish_id, d.name as dish_name, uh.servings_requested, uh.timestamp
     FROM user_history uh
     JOIN dishes d ON uh.dish_id = d.id
     WHERE uh.user_id = ?
     ORDER BY uh.timestamp DESC`,
    [user_id]
  );
  return rows;
};

module.exports = { logHistory, getUserHistory }; 