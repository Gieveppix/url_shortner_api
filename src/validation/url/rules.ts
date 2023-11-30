import { check } from 'express-validator';

export const createRules = [
  check('urlName', 'URL name should be a string with letters and/or numbers and/or special characters').optional().isString().isLength({ min: 1 }),
  check('originalUrl', 'Invalid original URL format').isURL(),
  check('shortUrl', 'Short URL should be a string with letters and/or numbers and/or some special characters').optional().isString().isLength({ min: 1 }),
  check('urlLength', 'URL length should be a number').optional().isNumeric(),
  check('urlCapitalization', 'URL capitalization should be lowercase or uppercase').optional().isIn(['lowercase', 'uppercase']),
];

export const editRules = [
  check('urlName', 'URL name should be a string with letters and/or numbers and/or special characters').optional().isString().isLength({ min: 1 }),
  check('originalUrl', 'Invalid original URL format').optional().isURL(),
  check('shortUrl', 'Short URL should be a string with letters and/or numbers and/or some special characters').optional().isString().isLength({ min: 1 }),
];
