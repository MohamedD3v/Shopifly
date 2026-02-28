import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.model';
import { SubCategory } from './subCategory.model';
import { Brand } from './brand.model';
import { User } from './user.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
  })
  title: string;
  @Prop({
    type: String,
    trim: true,
    required: true,
  })
  slug: string;
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 2000,
  })
  description: string;
  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;
  @Prop({
    type: Number,
    default: 0,
  })
  sold?: number;
  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: Number,
  })
  priceAfterDiscount?: number;
  @Prop({
    type: String,
    required: true,
  })
  imageCover: string;
  @Prop({
    type: [String],
  })
  images?: string[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
    required: true,
  })
  subCategory: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand?: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  rateAverage?: number;
  @Prop({
    type: Number,
    default: 0,
  })
  rateQuantity?: number;
}
export type HProductDocument = HydratedDocument<Product>;
export const productSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: productSchema,
  },
]);
