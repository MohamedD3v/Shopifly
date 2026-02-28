import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @Length(3, 25)
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  @Length(3, 1000)
  description?: string;
  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;
  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  brands?: Types.ObjectId[];
}
