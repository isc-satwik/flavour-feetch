const historyModel = require('../models/historyModel');

const getUserHistory = async (req, res) => {
  const userId = req.user.userId;
  try {
    const history = await historyModel.getUserHistory(userId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getUserHistory }; 