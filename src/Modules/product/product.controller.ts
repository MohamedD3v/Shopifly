import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { IProductDTO } from './dto/create-product.dto';
import { createProductSchema } from './dto/product.validation';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/user.enum';
import { AuthGuard, RolesGuard } from 'src/common/guard/auth.guard';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ZodPipe } from 'src/common/pipes/zod.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles([RoleEnum.admin])
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('imageCover', {
      storage: diskStorage({
        destination: './src/uploads/product',
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
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(new ZodPipe(createProductSchema as any)) createProduct: IProductDTO,
    @Req() req: any,
  ) {
    if (req.file) {
      createProduct.imageCover = req.file.filename;
    }
    const userId = req.user?._id;
    return this.productService.create(createProduct, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: IProductDTO) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
