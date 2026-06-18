'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getDashboard } = require('../controllers/storeowner.controller');


router.use(authenticate, authorize('store_owner'));


router.get('/dashboard', getDashboard);

module.exports = router;
