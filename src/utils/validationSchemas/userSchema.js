import * as Zod from 'zod';

export const USER_VALIDATION_SCHEMA = Zod.object({
  id: Zod.number().min(0),
  email: Zod.string().trim().toLowerCase().email(),
  password_hash: Zod.string(),
  role: Zod.string().trim().min(1),
  player_id: Zod.number().min(0),
  created_at: Zod.date().min(new Date()),
});
