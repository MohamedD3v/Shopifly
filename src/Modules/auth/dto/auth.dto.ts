import z from 'zod';
import {
  confirmEmailSchema,
  createUserSchema,
  loginSchema,
} from './auth.validation';

export type ISignupDto = z.infer<typeof createUserSchema>;
export type ILoginDto = z.infer<typeof loginSchema>;
export type IConfirmEmail = z.infer<typeof confirmEmailSchema>;
