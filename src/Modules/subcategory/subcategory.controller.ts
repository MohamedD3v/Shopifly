import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { ICreateSubCategoryDTO } from './dto/create-subcategory.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/user.enum';
import { AuthGuard, RolesGuard } from 'src/common/guard/auth.guard';
import { ZodPipe } from './../../common/pipes/zod.pipe';
import { createSubCategorySchema } from './dto/subCategory.validation';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}
  @Roles([RoleEnum.admin])
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/category',
        filename: (req, file, cb) => {
          const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname} - ${suffix} - ${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 3 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Images Only'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodPipe(createSubCategorySchema))
    subCategory: ICreateSubCategoryDTO,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?._id;
    return this.subcategoryService.create(subCategory, userId);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: string) {
    return this.subcategoryService.findOne(categoryId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: ICreateSubCategoryDTO,
  ) {
    return this.subcategoryService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
