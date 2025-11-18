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

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }
}
