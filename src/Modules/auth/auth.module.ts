import { Module } from '@nestjs/common';
import { UserModel } from 'src/DB/models/user.model';
import { AuthController } from './auth.controller';
import { OtpModel } from 'src/DB/models/otp.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModel , OtpModel , JwtModule ],
  exports:[JwtModule,MongooseModule],
  controllers: [AuthController],
  providers: [ AuthService],
})
export class AuthModule {
  constructor() {}
}
