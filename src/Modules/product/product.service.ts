import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IProductDTO } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HProductDocument, Product } from 'src/DB/models/product.model';
import { Model } from 'mongoose';
import { Category, HCategoryDocument } from 'src/DB/models/category.model';
import {
  HSubCategoryDocument,
  SubCategory,
} from 'src/DB/models/subCategory.model';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<HProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<HCategoryDocument>,
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<HSubCategoryDocument>,
  ) {}
  async create(createProduct: IProductDTO, userId: string) {
    const category = await this.categoryModel.findOne({_id:createProduct.category});
    if (!category) throw new NotFoundException('category ID Not Found');

    const subCategory = await this.subCategoryModel.findOne({
      _id: createProduct.subCategory,
      category: createProduct.category,
    });
    if (!subCategory)
      throw new BadRequestException('invalid SubCategory or Category IDs');

    const slug = slugify(createProduct.title, { lower: true });
    const createNewProduct = await this.productModel.create({
      ...createProduct,
      slug: slug,
      createdBy: userId,
    });
    return createNewProduct;
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: IProductDTO) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
