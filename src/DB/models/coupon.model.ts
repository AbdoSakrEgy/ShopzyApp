import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    unique: true,
  })
  code: string;

  @Prop({
    type: Number,
    min: 1,
    max: 100,
    required: true,
  })
  discountPrecent: number;

  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = HydratedDocument<Coupon>;
export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: couponSchema },
]);
// TTL (Time-To-Leave)
couponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
