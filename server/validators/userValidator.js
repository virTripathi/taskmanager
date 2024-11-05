import { body, validationResult } from 'express-validator';

export const validateRegisterUser = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('isAdmin')
    .optional()
    .isBoolean().withMessage('isAdmin must be a boolean'),

  body('role')
    .optional()
    .isString().withMessage('Role must be a string'),

  body('title')
    .optional()
    .isString().withMessage('Title must be a string'),
];
