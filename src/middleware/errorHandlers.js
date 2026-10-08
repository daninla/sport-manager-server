import { ZodError } from 'zod';

export const ValidationErrorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({ errors: [{ title: 'Validation error', details: error.errors }] });
  }
  console.error(error?.message);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return;
  res
    .status(error?.status ?? 500)
    .send({ errors: [{ title: error?.message ?? 'Internal server error' }] });
  console.error(error?.message);
};
