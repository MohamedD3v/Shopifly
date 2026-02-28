import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandModel } from 'src/DB/models/brand.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BrandModel , AuthModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
