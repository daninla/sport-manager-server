import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  user_email: Zod.string().trim().toLowerCase().email().optional(),
  birth_date: Zod.coerce.date().max(new Date()).optional(),
  city: Zod.string().trim().min(10).optional(),
  rank_category: Zod.string().trim().min(1).max(5).optional(),
  ukr_rating: Zod.number().min(0).nullish(),
  club: Zod.string().trim().min(1).optional(),
  notes: Zod.string().trim().optional(),
  updated_at: Zod.coerce.date().default(() => new Date()),
});
