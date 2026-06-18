'use strict';

const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [storeRows] = await pool.query(
      'SELECT id, name, email, address FROM stores WHERE owner_id = ?',
      [userId]
    );

    if (!storeRows.length) {
      return res.json({ store: null, avgRating: 0, totalRatings: 0, raters: [] });
    }

    const store = storeRows[0];

    const [[stats]] = await pool.query(
      `SELECT ROUND(COALESCE(AVG(rating), 0), 1) as avgRating,
              COUNT(id) as totalRatings
       FROM ratings WHERE store_id = ?`,
      [store.id]
    );

    const [raters] = await pool.query(
      `SELECT u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       INNER JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({
      store,
      avgRating: parseFloat(stats.avgRating),
      totalRatings: parseInt(stats.totalRatings),
      raters,
    });
  } catch (err) {
    console.error('[storeowner/getDashboard]', err.message);
    res.status(500).json({ message: 'Failed to load dashboard data.' });
  }
};

module.exports = { getDashboard };
