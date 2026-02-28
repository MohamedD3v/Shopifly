import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IConfirmEmail, ILoginDto, ISignupDto } from './dto/auth.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggerInterceptor } from 'src/common/interceptor/logger.interceptor';
import { ResposeInterceptor } from 'src/common/interceptor/response.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/user.enum';
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
  @Roles([RoleEnum.admin, RoleEnum.user])
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: ILoginDto) {
    return await this.authService.login(body);
  }
  @UseGuards(AuthGuard)
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    return await this.authService.getProfile(req);
  }

  @Post('/upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads',
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
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.authService.uploadFile(file);
  }
}
