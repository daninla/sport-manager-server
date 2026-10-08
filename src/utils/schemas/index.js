import z from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tournament_id: z
    .number()
    .int()
    .positive("Tournament ID must be a positive integer"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});
