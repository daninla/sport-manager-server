import * as Zod from 'zod';

export const USER_VALIDATION_SCHEMA = Zod.object({
  first_name: Zod.string().trim().min(1),
  last_name: Zod.string().trim().min(1),
  email: Zod.string().trim().toLowerCase().email(),
  password_hash: Zod.string(),
  role: Zod.string().trim().min(1),
  updated_at: Zod.coerce.date().default(() => new Date()),
});
