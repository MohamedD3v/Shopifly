import {
  BadRequestException,
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HUserDocument, User } from 'src/DB/models/user.model';
import { IConfirmEmail, ILoginDto, ISignupDto } from './dto/auth.dto';
import { HOtpDocument, Otp } from 'src/DB/models/otp.model';
import { generateOtp } from 'src/common/utils/generateOTP/otp.generate';
import { OTPEnum, ProviderEnum } from 'src/common/enums/user.enum';
import { compare } from 'src/common/utils/hashing/hash';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<HOtpDocument>,
    private jwtService: JwtService,
  ) {}
  async createOtp(userId: Types.ObjectId) {
    await this.otpModel.create([
      {
        createdBy: userId,
        code: generateOtp(),
        expiredAt: new Date(Date.now() + 3 * 60 * 1000),
        type: OTPEnum.verify_email,
      },
    ]);
  }
  async signup(body: ISignupDto) {
    const { firstName, lastName, email, password } = body as ISignupDto;
    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) throw new ConflictException('Email Already Exist');
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password,
    });
    await this.createOtp(newUser._id);
    return { message: 'User has been Created Successfully ', newUser };
  }

  async resendOtp(body: IConfirmEmail) {
    const { email } = body as IConfirmEmail;
    const checkUser = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([{ path: 'otp', match: { type: OTPEnum.verify_email } }]);
    if (!checkUser) throw new NotFoundException('User not found');
    if (checkUser.otp?.length) throw new ConflictException('Otp Already Exist');
    await this.createOtp(checkUser._id);
    return { message: 'OTP has been Sent Successfully ' };
  }
  async confirmEmail(body: IConfirmEmail) {
    const { email, otp } = body as IConfirmEmail;
    const user = await this.userModel
      .findOne({ email, confirmEmail: { $exists: false } })
      .populate([
        {
          path: 'otp',
          match: { type: OTPEnum.verify_email },
        },
      ]);
    if (!user) throw new NotFoundException('user not found');
    if (!user.otp?.length) throw new NotFoundException('Otp Expired');
    if (!(await compare(otp, user.otp[0].code)))
      throw new BadRequestException('in-valid otp');
    await this.userModel.updateOne(
      { _id: user._id },
      { $set: { confirmEmail: new Date() } },
    );
    return { message: 'Email has been Confirmed Successfully' };
  }
  async login(body: ILoginDto) {
    const { email, password } = body as ILoginDto;
    const user = await this.userModel.findOne({
      email,
      provider: ProviderEnum.system,
    });
    if (!user) throw new NotFoundException('user not found');
    if (!user.confirmEmail)
      throw new BadRequestException('Return Confirm Your Account');
    if (!(await compare(password, user.password)))
      throw new BadRequestException('Wrong Email or Password');
    const jwtId = randomUUID();
    const access_token = this.jwtService.sign(
      { _id: user._id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET as string,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES),
        jwtid: jwtId,
      },
    );
    const refresh_token = this.jwtService.sign(
      { _id: user._id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET as string,
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES),
        jwtid: jwtId,
      },
    );
    return {
      message: `Successfully Login Welcome Back ${user.firstName}`,
      access_token,
      refresh_token,
    };
  }
  async getProfile(req: any) {
    return { message: 'profile fetched', user: req.user };
  }
}
