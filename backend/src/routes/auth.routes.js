'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} = require('../utils/validators');
const {
  register,
  login,
  updatePassword,
} = require('../controllers/auth.controller');


router.post('/register', registerValidation, register);


router.post('/login', loginValidation, login);


router.put('/update-password', authenticate, updatePasswordValidation, updatePassword);

module.exports = router;
