import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.model';
import { User } from './user.model';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
  })
  slug: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;
}
export type HSubCategoryDocument = HydratedDocument<SubCategory>;
export const subCategorySchema = SchemaFactory.createForClass(SubCategory);
export const SubCategoryModel = MongooseModule.forFeature([
  {
    name: SubCategory.name,
    schema: subCategorySchema,
  },
]);
