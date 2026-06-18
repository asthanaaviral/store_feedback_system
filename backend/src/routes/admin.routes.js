'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { addUserValidation, addStoreValidation } = require('../utils/validators');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  addUser,
  getStores,
  addStore,
  getStoreOwners,
} = require('../controllers/admin.controller');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/users', getUsers);
router.post('/users', addUserValidation, addUser);
router.get('/users/:id', getUserById);

router.get('/stores', getStores);
router.post('/stores', addStoreValidation, addStore);

// Used to populate the store owner dropdown when adding a store
router.get('/store-owners', getStoreOwners);

module.exports = router;
