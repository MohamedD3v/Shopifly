import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { SubCategoryModel } from 'src/DB/models/subCategory.model';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/user.model';

@Module({
  imports: [SubCategoryModel, UserModel],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, JwtService],
})
export class SubcategoryModule {}
