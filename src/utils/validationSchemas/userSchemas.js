import * as Zod from 'zod';

export const USER_VALIDATION_SCHEMA = Zod.object({
  first_name: Zod.string().trim().min(1),
  last_name: Zod.string().trim().min(1),
  email: Zod.string().trim().toLowerCase().email(),
  password: Zod.string().min(1),
  updated_at: Zod.coerce.date().default(() => new Date()),
});

export const USER_PATCH_VALIDATION_SCHEMA = Zod.object({
  first_name: Zod.string().trim().min(1).optional(),
  last_name: Zod.string().trim().min(1).optional(),
  email: Zod.string().trim().toLowerCase().email().optional(),
  password: Zod.string().min(1).optional(),
  updated_at: Zod.coerce.date().default(() => new Date()),
});

export const USER_DELETE_VALIDATION_SCHEMA = Zod.object({
  password: Zod.string().min(1),
});
