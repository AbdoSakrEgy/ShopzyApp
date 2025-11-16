import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OtpTypeEnum } from 'src/common/types/user.type';
import { hash } from 'src/common/utils/security/hash.utils';

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: String, required: true, enum: Object.values(OtpTypeEnum) })
  type: string;
}

export const otpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
// TTL (Time-To-Live)
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
// hooks
otpSchema.pre('save', async function (next) {
  if (this.isModified('code')) {
    this.code = await hash(this.code);
  }
  next();
});
