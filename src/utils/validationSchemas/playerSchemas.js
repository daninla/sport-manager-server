import * as Zod from 'zod';

export const PLAYER_VALIDATION_SCHEMA = Zod.object({
  ukr_rate: Zod.number().min(0).max(100),
  rank_category: Zod.string().trim().max(20).optional(),
  club: Zod.string().trim().optional(),
  notes: Zod.string().trim().optional(),
  sex: Zod.enum(['male', 'female']),
  city: Zod.string().trim().optional(),
  birth_date: Zod.coerce.date().max(new Date()),
  user_id: Zod.number().min(1),
  updated_at: Zod.coerce.date().default(() => new Date()),
});

export const PLAYER_PATCH_VALIDATION_SCHEMA = Zod.object({
  ukr_rate: Zod.number().min(0).max(100).optional(),
  rank_category: Zod.string().trim().max(20).optional(),
  club: Zod.string().trim().optional(),
  notes: Zod.string().trim().optional(),
  sex: Zod.enum(['male', 'female']).optional(),
  city: Zod.string().trim().optional().optional(),
  birth_date: Zod.coerce.date().max(new Date()).optional(),
  user_id: Zod.number().min(1).optional(),
  updated_at: Zod.coerce.date().default(() => new Date()),
});
