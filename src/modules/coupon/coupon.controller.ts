import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import {
  createCouponSchema,
  type CreateCouponDto,
} from './dto/create-coupon.dto';
import { type UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/coupon')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create')
  @UsePipes(new ZodValidationPipe(createCouponSchema))
  create(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.couponService.create(req, body);
  }
}
