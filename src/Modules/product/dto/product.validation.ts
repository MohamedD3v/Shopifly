import { Types } from 'mongoose';
import z, { string } from 'zod';

export const createProductSchema = z
  .strictObject({
    title: z.string().min(3).max(200),
    description: z.string().min(3).max(2000),
    quantity: z.coerce.number().nonnegative().default(0),
    price: z.coerce.number().positive(),
    priceAfterDiscount: z.coerce.number().positive().optional(),

    imageCover: z.string().optional(),
    images: z.array(z.string()).optional(),

    category: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'invalid category id',
    }),
    subCategory: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'invalid subCategory id',
    }),
    brand: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'invalid brand id',
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.priceAfterDiscount && data.priceAfterDiscount >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: 'Price after discount must be less than original price',
      path: ['priceAfterDiscount'],
    },
  );
