import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IConfirmEmail, ILoginDto, ISignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signup(@Body() body: ISignupDto) {
    return this.authService.signup(body);
  }
  @Post('/resend-otp')
  async resendOtp(@Body() body: IConfirmEmail) {
    return await this.authService.resendOtp(body);
  }

  @Patch('/confirm-email')
  async confirmEmail(@Body() body: IConfirmEmail) {
    return await this.authService.confirmEmail(body);
  }

  @Post('/login')
  async login(@Body() body: ILoginDto) {
    return await this.authService.login(body);
  }
}
