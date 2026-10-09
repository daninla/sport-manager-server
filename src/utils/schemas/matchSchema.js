import z from "zod";

export const matchSchema = z.object({
  tournament_id: z.number().int().positive("Tournament ID must be a positive integer"),
  stage: z.string().min(1, "Stage is required"),
  group_id: z.number().int().positive().nullable().optional(),
  round: z.number().int().positive().nullable().optional(),
  player1_id: z.number().int().positive("Player 1 ID must be a positive integer"),
  player2_id: z.number().int().positive("Player 2 ID must be a positive integer"),
  winner_id: z.number().int().positive().nullable().optional(),
  status: z.enum(["upcoming", "in_progress", "finished", "cancelled","pending"]).default("upcoming"),
  starts_at: z.string().datetime({ message: "Invalid ISO date string" }).nullable().optional(),
  table_number: z.number().int().positive().nullable().optional(),
  duration_seconds: z.number().int().nonnegative().nullable().optional(),
  sets: z.any().nullable().optional(), // Підходить для JSON/JSONB або масиву рахунків
  current_set: z.number().int().positive().nullable().optional(),
  bracket_id: z.number().int().positive().nullable().optional(),
  bracket_position: z.number().int().positive().nullable().optional(),
});