import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  id: Zod.number().min(1).optional(),
  user_email: Zod.string().trim().toLowerCase().email().optional(),
  user_id: Zod.number().min(1).optional(),
  birth_date: Zod.date().min(new Date()).optional(),
  city: Zod.string().trim().min(10).optional(),
  rank_category: Zod.string().trim().min(2).max(5).optional(),
  ukr_rating: Zod.number().min(0).nullish(),
  club: Zod.string().trim().min(1).optional(),
  notes: Zod.string().trim().array().optional(),
  updated_at: Zod.coerce.date().nullish(),
});
