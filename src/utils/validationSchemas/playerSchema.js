import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  id: Zod.number().min(0),
  first_name: Zod.string().trim().min(2),
  last_name: Zod.string().trim().min(1),
  birth_date: Zod.date().min(new Date()).optional(),
  city: Zod.string().trim().min(10).optional(),
  rank_category: Zod.string().trim().min(2).max(5).optional(),
  ukr_rating: Zod.number().min(0).optional(),
  world_rating: Zod.number().min(0).optional(),
  club: Zod.string().trim().min(1).optional(),
  notes: Zod.string().trim().array().optional(),
  created_at: Zod.date().min(new Date()).optional(),
});