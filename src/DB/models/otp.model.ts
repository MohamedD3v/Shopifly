import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose, ObjectId, Types } from 'mongoose';
import { OTPEnum } from 'src/common/enums/user.enum';
import { emailEvent } from 'src/common/utils/events/email.event';
import { compare, hash } from 'src/common/utils/hashing/hash';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Otp {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  code: string;
  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
  @Prop({
    type: String,
    enum: OTPEnum,
    required: true,
  })
  type: OTPEnum;
}
export type HOtpDocument = HydratedDocument<Otp>;
export const otpSchema = SchemaFactory.createForClass(Otp);
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.pre(
  'save',
  async function (this: HOtpDocument & { wasNew: boolean; plainOtp?: string }) {
    this.wasNew = this.isNew;
    if (this.isModified('code')) {
      this.plainOtp = this.code;
      this.code = await hash(this.code);
      await this.populate('createdBy');
    }
  },
);
otpSchema.post('save', async function () {
  const that = this as HOtpDocument & { wasNew?: boolean; plainOtp?: string };
  if (that.wasNew && that.plainOtp) {
    emailEvent.emit('confirmEmail', {
      to: (that.createdBy as any ).email,
      otp: that.plainOtp,
      firstName: (that.createdBy as any).firstName,
    });
  }
});
export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
    schema: otpSchema,
  },
]);
