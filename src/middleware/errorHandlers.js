import { ZodError } from 'zod';

export const validationErrorHandler = (error, req, res, next) => {
  console.log('validationError', req.body);
  if (error instanceof ZodError) {
    return res
    .status(400)
    .send({ errors: [{ title: 'Validation error', details: error.errors }] });
  }
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  console.log('error', req.body);
  if (res.headersSent) return;
  res
    .status(error?.status ?? 500)
    .send({ errors: [{ title: error?.message ?? 'Internal server error' }] });
  console.error(error?.message);
};
