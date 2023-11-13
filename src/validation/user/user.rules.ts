import { check } from "express-validator";

export const loginRules = [
  check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
  check('password', 'Your password must be at least 4 characters').not().isEmpty().isLength({ min: 4 }),
]

// TODO: add some kind of entropy check later
export const registerRules = [
  check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
  check('password', 'Your password must be at least 4 characters')
  .not()
  .isEmpty()
  .isLength({ min: 4 }),
  check('firstName', 'First name must be defined').not().isEmpty(),
  check('lastName', 'Last name must be defined').not().isEmpty(),
]