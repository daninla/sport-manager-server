import * as Zod from 'zod';

export const USER_VALIDATION_SCHEMA = Zod.object({
  id: Zod.number().min(0).optional(),
  login: Zod.string().trim().min(1),
  email: Zod.string().trim().toLowerCase().email(),
  password_hash: Zod.string(),
  role: Zod.string().trim().min(1),
  player_id: Zod.number().min(0).optional(),
  updated_at: Zod.coerce.date().optional(),
});
