import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/DB/models/category.model';
import { Model, Types } from 'mongoose';
import { Brand } from 'src/DB/models/brand.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}
  async create(body: CreateCategoryDto, image: string) {
    const category = await this.categoryModel.findOne({ name: body.name });
    if (category) throw new ConflictException('category already exist');
    if (body.brands && body.brands?.length > 0) {
      const invalid_id = body.brands.find((id) => !Types.ObjectId.isValid(id));
      if (invalid_id)
        throw new BadRequestException(`In-valid brand id ${invalid_id}`);
    }
    const brands = await this.brandModel.find({
      _id: { $in: body.brands },
    });
    if (brands.length !== body.brands?.length)
      throw new BadRequestException('Missing brands id');
    const newCategory = await this.categoryModel.create({
      ...body,
      image,
    });
    return newCategory;
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    return await this.categoryModel.findById(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
