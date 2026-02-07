import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HUserDocument, User } from 'src/DB/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}
  async signup(body: unknown) {
    const { firstName, lastName, email, password, confirmPassword } = body;
    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) throw new ConflictException('Email Already Exist');
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password,
    });
    return { message: 'User has been Created Successfully ', newUser };
  }
}
