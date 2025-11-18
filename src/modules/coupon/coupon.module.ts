import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, couponSchema } from 'src/DB/models/coupon.model';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: couponSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService, JwtService],
})
export class CouponModule {}
