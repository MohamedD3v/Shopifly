import z from 'zod';
import { createSubCategorySchema } from './subCategory.validation';
export type ICreateSubCategoryDTO = z.infer<typeof createSubCategorySchema>;
