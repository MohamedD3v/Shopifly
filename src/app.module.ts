import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './DB/models/user.model';
import { OtpModel } from './DB/models/otp.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { logger, LoggerMiddleware } from './Middleware/logger.middleware';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
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
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('/auth');
  }
}
