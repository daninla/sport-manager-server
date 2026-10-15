import z from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});

export const groupUpdateSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    capacity: z.coerce
      .number()
      .int()
      .positive("Capacity must be a positive integer")
      .optional(),
    player_ids: z.array(z.coerce.number().int().positive()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
