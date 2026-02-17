import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IConfirmEmail, ILoginDto, ISignupDto } from './dto/auth.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggerInterceptor } from 'src/common/interceptor/logger.interceptor';
import { ResposeInterceptor } from 'src/common/interceptor/response.interceptor';
@UseInterceptors(LoggerInterceptor, ResposeInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  @HttpCode(HttpStatus.ACCEPTED)
  signup(@Body() body: ISignupDto) {
    return this.authService.signup(body);
  }
  @Post('/resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: IConfirmEmail) {
    return await this.authService.resendOtp(body);
  }

  @Patch('/confirm-email')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() body: IConfirmEmail) {
    return await this.authService.confirmEmail(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: ILoginDto) {
    return await this.authService.login(body);
  }
  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    return await this.authService.getProfile(req);
  }
}
