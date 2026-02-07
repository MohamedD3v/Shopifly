import { GenderEnum, ProviderEnum } from 'src/common/enums/user.enum';
import z from 'zod';

export const createUserSchema = z
  .strictObject({
    firstName: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    gender: z.enum(GenderEnum).default(GenderEnum.male).optional(),
    provider: z.enum(ProviderEnum).default(ProviderEnum.system).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password not match',
    path: ['confirmPassword'],
  });
