import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from 'src/DB/models/coupon.model';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  // =========================== create ===========================
  async create(req: any, body: CreateCouponDto) {
    const user = req.user;
    const { code } = body;
    // step: check coupone existence
    const checkCoupon = await this.couponModel.findOne({ code });
    if (checkCoupon) {
      throw new ConflictException('Coupon already exists');
    }
    // step: check coupon validation
    const validCoupons = [
      {
        code: 'VADA-DADF-2Q-D312',
        discountPrecent: 36,
        expiresAt: new Date('12-18-2025'),
      },
    ];
    const checkCouponValidation = validCoupons.find(
      (item) => item.code == code,
    );
    if (!checkCouponValidation) {
      throw new NotFoundException('Invalid coupon');
    }
    // step: create coupon
    const coupon = await this.couponModel.create({
      code,
      discountPrecent: checkCouponValidation.discountPrecent,
      expiresAt: checkCouponValidation.expiresAt,
      createdBy: user._id,
    });
    return { message: 'Coupon created successfully', result: { coupon } };
  }
}
