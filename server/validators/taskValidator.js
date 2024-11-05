import { body, param, query } from 'express-validator';

export const validateCreateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('assignedTo').isInt().withMessage('Invalid Assigned user'),
  body('stage').optional().isString().withMessage('Stage must be a string'),
  body('due_date').isISO8601().toDate().withMessage('Due date must be in ISO format'),
  body('priority')
    .isIn(['high', 'medium', 'low'])
    .withMessage('Priority must be either high, medium, or low'),
];

export const validateGetTasks = [
  query('stage').optional().isString().withMessage('Stage must be a string'),
  query('isTrashed').optional().isBoolean().withMessage('isTrashed must be a boolean')
];

export const validateGetTask = [
  param('id').isInt().withMessage('Task ID must be a valid integer')
];

export const validateUpdateTask = [
  param('id').isInt().withMessage('Task ID must be a valid integer'),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('due_date').optional().isISO8601().toDate().withMessage('Due date must be in ISO format'),
  body('assignedTo').optional().isInt().withMessage('Assigned user ID must be a valid integer'),
  body('stage').optional().isString().withMessage('Stage must be a string'),
  body('priority')
    .optional()
    .isIn(['high', 'medium', 'low'])
    .withMessage('Priority must be either high, medium, or low'),
  body('assets').optional().isArray().withMessage('Assets must be an array')
];

export const validateUpdateTaskStatus = [
  param('id').isInt().withMessage('Task ID must be a valid integer'),
  param('slug')
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be one of pending, in-progress, completed, or archived')
];

export const validateDeleteTask = [
  param('id').optional().isInt().withMessage('Invalid Task ID')
];

export const validateAssignTask = [
  param('id').isInt().withMessage('Task ID must be a valid integer'),
  body('assignedTo').isInt().withMessage('Assigned user ID must be a valid integer')
];
