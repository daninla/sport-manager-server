import {
  PLAYER_VALIDATION_SCHEMA,
  USER_VALIDATION_SCHEMA,
} from '../utils/validationSchemas/index.js';

export const validatePlayer = async (req, res, next) => {
  try {
    const validatedBody = await PLAYER_VALIDATION_SCHEMA.validate(req.body);
    req.body = validatedBody;
    next();
  } catch (error) {
    next(`Error is ${error.errors}`);
  }
};

export const validateUser = async (req, res, next) => {
  try {
    const validatedBody = await USER_VALIDATION_SCHEMA.validate(req.body);
    req.body = validatedBody;
    next();
  } catch (error) {
    next(`Error is ${error.errors}`);
  }
};
