'use strict';

const pool = require('../config/db');

const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    let sql = `
      SELECT
        s.id,
        s.name,
        s.address,
        ROUND(COALESCE(
          (SELECT AVG(r.rating) FROM ratings r WHERE r.store_id = s.id),
        0), 1) as avgRating,
        (
          SELECT r2.rating FROM ratings r2
          WHERE r2.store_id = s.id AND r2.user_id = ?
          LIMIT 1
        ) as userRating
      FROM stores s
      WHERE 1=1
    `;
    const params = [userId];

    if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    sql += ' ORDER BY s.name ASC';

    const [stores] = await pool.query(sql, params);
    res.json(stores);
  } catch (err) {
    console.error('[user/getStores]', err.message);
    res.status(500).json({ message: 'Failed to load stores.' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const [storeCheck] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (!storeCheck.length) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already rated this store.' });
    }

    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully!' });
  } catch (err) {
    console.error('[submitRating]', err.message);
    res.status(500).json({ message: 'Failed to submit rating.' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    if (!existing.length) {
      return res.status(404).json({ message: 'No existing rating found to update.' });
    }

    await pool.query(
      'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
      [rating, userId, storeId]
    );

    res.json({ message: 'Rating updated successfully!' });
  } catch (err) {
    console.error('[updateRating]', err.message);
    res.status(500).json({ message: 'Failed to update rating.' });
  }
};

module.exports = { getStores, submitRating, updateRating };
