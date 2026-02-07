import { Body, Controller, Get, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'zod';
import { createUserSchema } from './dto/createUser.dto';
import { PasswordMatchPipe } from 'src/common/pipes/password-match.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/:id')
  @UsePipes( new PasswordMatchPipe())
  getProfile(@Body() body: unknown) {
    console.log(body);

    return this.authService.getProfile();
  }
}
