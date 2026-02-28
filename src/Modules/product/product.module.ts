import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/DB/models/product.model';
import { CategoryModel } from 'src/DB/models/category.model';
import { SubCategoryModel } from 'src/DB/models/subCategory.model';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/user.model';

@Module({
  imports: [ProductModel, CategoryModel, SubCategoryModel, UserModel],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
