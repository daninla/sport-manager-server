import z from 'zod';

export const tournamentSchema = z.object({
    name: z.string().trim().min(1, 'This field is required'),
    startsAt: z.iso.datetime(),
    location: z.string().trim(),
    tablesCount: z.number().int().positive('The number of available standing tables must be a positive integer'),
    tournamentType: z.string(),
    format: z.string(),
    bestOf: z.number().int().positive('The number bestOf must be a positive integer'),
    maxParticipants: z.number().int().positive('The number max must be a positive integer'),
    isRated: z.boolean(),
    ratingCoefficient: z.number(),
    ageCategory: z.string(),
    ratingLimit: z.number().int().nonnegative('The number rating limit must be a positive integer'),
    gender: z.string(),
});
