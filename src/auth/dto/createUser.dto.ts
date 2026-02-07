import z from 'zod';

export const createUserSchema = z.strictObject({
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  email: z.email(),
  password: z.string().min(8),
});
