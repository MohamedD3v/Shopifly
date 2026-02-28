import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { UserModule } from './Modules/user/user.module';
import { ProductModule } from './Modules/product/product.module';
import { AuthController } from './Modules/auth/auth.controller';
import { AuthModule } from './Modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './DB/models/user.model';
import { OtpModel } from './DB/models/otp.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './Modules/auth/auth.service';
import { logger } from './Middleware/logger.middleware';
import { BrandModule } from './Modules/brand/brand.module';
import { CategoryModule } from './Modules/category/category.module';
import { SubcategoryModule } from './Modules/subcategory/subcategory.module';
import { SubCategoryModel } from './DB/models/subCategory.model';
import { CartModule } from './cart/cart.module';
import { ProductModel } from './DB/models/product.model';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 10000,
      onConnectionCreate(connection) {
        connection.on('connected', () => {
          console.log('Database has been Connected Successfully');
        });
      },
    }),
    AuthModule,
    UserModule,
    ProductModule,
    UserModel,
    OtpModel,
    JwtModule,
    BrandModule,
    CategoryModule,
    SubcategoryModule,
    SubCategoryModel,
    CartModule,
    ProductModel,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('/auth');
  }
}
