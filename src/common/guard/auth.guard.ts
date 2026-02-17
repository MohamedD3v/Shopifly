import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from 'src/DB/models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Please Input Authorization Token');
    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException('in-valid token format');
    const payload = this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    const user = await this.userModel.findById(payload._id);
    if (!user) throw new NotFoundException('user not found');
    request.user = user;
    return true;
  }
}
