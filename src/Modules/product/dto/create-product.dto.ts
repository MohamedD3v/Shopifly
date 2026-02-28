import z from 'zod';
import { createProductSchema } from './product.validation';

export type IProductDTO = z.infer<typeof createProductSchema>;
