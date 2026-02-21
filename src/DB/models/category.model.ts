import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 25,
  })
  name: string;
  @Prop({
    type: String,
    minLength: 3,
    maxLength: 25,
  })
  slug: string;
  @Prop({
    type: String,
    minLength: 3,
    maxLength: 1000,
  })
  description: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
  @Prop({
    type: String,
    required: true,
  })
  image: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
  })
  brands: Types.ObjectId[];
}
export type HCategoryDocument = HydratedDocument<Category>;
export const categorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: categorySchema,
  },
]);
