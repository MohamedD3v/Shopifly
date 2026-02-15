import { Module } from '@nestjs/common';
import { UserModel } from 'src/DB/models/user.model';
import { AuthController } from './auth.controller';
import { OtpModel } from 'src/DB/models/otp.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModel , OtpModel , JwtModule ],
  controllers: [AuthController],
  providers: [ AuthService],
})
export class AuthModule {
  constructor() {}
}
