import * as Zod from 'zod';

export const USER_VALIDATION_SCHEMA = Zod.object({
  email: Zod.string().trim().toLowerCase().email(),
  password_hash: Zod.string(),
  role: Zod.string().trim().min(1),
  player_id: Zod.number().min(0).optional(),
  created_at: Zod.date().min(new Date()),
});
