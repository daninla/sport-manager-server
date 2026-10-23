import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  user_email: Zod.string().trim().email().optional(),
  city: Zod.string().trim().optional(),
  sex: Zod.enum(['male', 'female']),
  birth_date: Zod.coerce.date().max(new Date()),
  club: Zod.string().trim().optional(),
  ukr_rating: Zod.number().min(0).max(100),
  rank_category: Zod.string().trim().max(10).optional(),
  notes: Zod.string().trim().optional(),
  updated_at: Zod.coerce.date().default(() => new Date()),
});
