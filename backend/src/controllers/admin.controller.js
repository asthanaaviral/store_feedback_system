'use strict';

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) as totalRatings FROM ratings');

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error('[getDashboardStats]', err.message);
    res.status(500).json({ message: 'Failed to load dashboard stats.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;

    const validSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let sql = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (name) { sql += ' AND name LIKE ?'; params.push(`%${name}%`); }
    if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }
    if (address) { sql += ' AND address LIKE ?'; params.push(`%${address}%`); }
    if (role) { sql += ' AND role = ?'; params.push(role); }

    sql += ` ORDER BY ${sortField} ${sortDir}`;

    const [users] = await pool.query(sql, params);
    res.json(users);
  } catch (err) {
    console.error('[getUsers]', err.message);
    res.status(500).json({ message: 'Failed to load users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // If this user is a store owner, also return their store's rating info
    if (user.role === 'store_owner') {
      const [stores] = await pool.query(
        `SELECT s.id, s.name, s.address,
                ROUND(COALESCE(AVG(r.rating), 0), 1) as avgRating,
                COUNT(r.id) as totalRatings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id, s.name, s.address`,
        [user.id]
      );
      user.stores = stores;
    }

    res.json(user);
  } catch (err) {
    console.error('[getUserById]', err.message);
    res.status(500).json({ message: 'Failed to load user details.' });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address, role]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('[addUser]', err.message);
    res.status(500).json({ message: 'Failed to create user.' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

    const validSortFields = ['name', 'email', 'address'];
    const colPrefix = validSortFields.includes(sortBy) ? `s.${sortBy}` : 's.name';
    const sortDir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let sql = `
      SELECT s.id, s.name, s.email, s.address,
             ROUND(COALESCE(AVG(r.rating), 0), 1) as avgRating,
             COUNT(r.id) as totalRatings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { sql += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    sql += ` GROUP BY s.id, s.name, s.email, s.address ORDER BY ${colPrefix} ${sortDir}`;

    const [stores] = await pool.query(sql, params);
    res.json(stores);
  } catch (err) {
    console.error('[admin/getStores]', err.message);
    res.status(500).json({ message: 'Failed to load stores.' });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'A store with this email already exists.' });
    }

    let validatedOwnerId = null;
    if (ownerId) {
      const [ownerCheck] = await pool.query(
        'SELECT id FROM users WHERE id = ? AND role = ?',
        [ownerId, 'store_owner']
      );
      if (!ownerCheck.length) {
        return res.status(400).json({ message: 'Selected owner is not a valid store owner.' });
      }
      validatedOwnerId = ownerId;
    }

    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, validatedOwnerId]
    );

    res.status(201).json({ message: 'Store added successfully.' });
  } catch (err) {
    console.error('[addStore]', err.message);
    res.status(500).json({ message: 'Failed to add store.' });
  }
};

const getStoreOwners = async (req, res) => {
  try {
    const [owners] = await pool.query(
      'SELECT id, name, email FROM users WHERE role = ? ORDER BY name ASC',
      ['store_owner']
    );
    res.json(owners);
  } catch (err) {
    console.error('[getStoreOwners]', err.message);
    res.status(500).json({ message: 'Failed to load store owners.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  addUser,
  getStores,
  addStore,
  getStoreOwners,
};
