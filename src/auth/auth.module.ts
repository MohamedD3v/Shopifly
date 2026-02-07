import { Module } from '@nestjs/common';
import { UserModel } from 'src/DB/models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  constructor() {}
}
