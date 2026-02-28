import { Types } from 'mongoose';
import z from 'zod';
export const createSubCategorySchema = z.strictObject({
  name: z.string().min(3).max(20),
  category: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'In-valid Category ID Format',
  }),
});
