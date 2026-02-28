import { Injectable } from '@nestjs/common';
import { ICreateSubCategoryDTO } from './dto/create-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  HSubCategoryDocument,
  SubCategory,
} from 'src/DB/models/subCategory.model';
import { Model } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<HSubCategoryDocument>,
  ) {}
  async create(subCategory: ICreateSubCategoryDTO, userId: string) {
    const slug = slugify(subCategory.name, { lower: true });
    const createSubCategory = await this.subCategoryModel.create({
      ...subCategory,
      slug: slug,
      createdBy: userId,
    });
    return createSubCategory;
  }

  async findAll() {
    const categories = await this.subCategoryModel.find();
    return categories;
  }

  async findOne(categoryId: string) {
    const category = await this.subCategoryModel.findOne({
      category: categoryId,
    });
    return category;
  }

  update(id: number, updateSubcategoryDto: ICreateSubCategoryDTO) {
    return `This action updates a #${id} subcategory`;
  }

  async remove(id: string) {
    const deleted = await this.subCategoryModel.deleteOne({ category: id });
    return deleted;
  }
}
