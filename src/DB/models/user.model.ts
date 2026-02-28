import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from 'src/common/enums/user.enum';
import { hash } from 'src/common/utils/hashing/hash';
import { HOtpDocument } from './otp.model';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxLength: 20,
    trim: true,
  })
  firstName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxLength: 20,
    trim: true,
  })
  lastName: string;
  @Virtual({
    get: function () {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (value: string) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  username: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({
    type: String,
    minlength: 8,
    required: function () {
      return this.provider === 'google' ? false : true;
    },
  })
  password: string;
  @Prop({
    type: Date,
  })
  confirmEmail: Date;
  @Prop({
    type: String,
  })
  confirmEmailOTP: string;
  @Prop({
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: 'invalid Gender',
    },
    default: GenderEnum.male,
  })
  gender: string;
  @Prop({
    type: String,
    enum: {
      values: Object.values(ProviderEnum),
      message: 'invalid Provider',
    },
    default: ProviderEnum.system,
  })
  provider: string;
  @Virtual()
  otp: HOtpDocument[];
  @Prop({
    type: String,
    enum: {
      values: Object.values(RoleEnum),
      message: 'In-valid Role',
    },
    default: RoleEnum.user,
  })
  role: RoleEnum;
}
export type HUserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
userSchema.virtual('otp', {
  localField: '_id',
  foreignField: 'createdBy',
  ref: 'Otp',
});
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
});
export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);
