import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  id: Zod.number().min(1).optional(),
  first_name: Zod.string().trim().min(2),
  last_name: Zod.string().trim().min(1),
  birth_date: Zod.date().min(new Date()).optional(),
  city: Zod.string().trim().min(10).optional(),
  rank_category: Zod.string().trim().min(2).max(5).optional(),
  ukr_rating: Zod.number().min(1).nullable(),
  club: Zod.string().trim().min(1).optional(),
  notes: Zod.string().trim().array().optional(),
  updated_at: Zod.coerce.date().nullish(),
});1