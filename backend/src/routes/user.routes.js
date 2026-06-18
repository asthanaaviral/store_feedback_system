'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { submitRatingValidation } = require('../utils/validators');
const {
  getStores,
  submitRating,
  updateRating,
} = require('../controllers/user.controller');


router.use(authenticate, authorize('user'));


router.get('/stores', getStores);


router.post('/ratings', submitRatingValidation, submitRating);


router.put('/ratings/:storeId', submitRatingValidation, updateRating);

module.exports = router;
