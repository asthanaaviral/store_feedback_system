'use strict';

const { body, validationResult } = require('express-validator');


const nameRules = () =>
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.');

const emailRules = () =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail();

const addressRules = () =>
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.');

const passwordRules = () =>
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8 to 16 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character.');

const ratingRules = () =>
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.');



const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};


const registerValidation = [
  nameRules(),
  emailRules(),
  addressRules(),
  passwordRules(),
  validate,
];

const loginValidation = [
  emailRules(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
];

const updatePasswordValidation = [
  passwordRules(),
  validate,
];

const addUserValidation = [
  nameRules(),
  emailRules(),
  addressRules(),
  passwordRules(),
  body('role')
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner.'),
  validate,
];

const addStoreValidation = [
  nameRules(),
  emailRules(),
  addressRules(),
  validate,
];

const submitRatingValidation = [
  ratingRules(),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  addUserValidation,
  addStoreValidation,
  submitRatingValidation,
  validate,
};
