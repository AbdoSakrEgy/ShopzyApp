import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  type AddToCartDto,
  addToCartSchema,
  createCartSchema,
  type CreateCartDto,
  updateCartProductSchema,
  type UpdateCartProductDto,
} from './dto/create-cart.dto';
import { updateCartSchema, type UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { type CreateCouponDto } from './../coupon/dto/create-coupon.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  @UsePipes(new ZodValidationPipe(addToCartSchema))
  create(@Req() req: any, @Body() body: AddToCartDto) {
    return this.cartService.addToCart(req, body);
  }

  @Get('/get-cart')
  findOne(@Req() req: any) {
    return this.cartService.getCart(req);
  }

  @Patch('/update-cart-product')
  @UsePipes(new ZodValidationPipe(updateCartProductSchema))
  updateCartProduct(@Req() req: any, @Body() body: UpdateCartProductDto) {
    return this.cartService.updateCartProduct(req, body);
  }

  @Delete('/remove-cart-product/:productId')
  removeCartProduct(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeCartProduct(req, productId);
  }

  @Post('/apply-coupon')
  applyCoupon(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.cartService.applyCoupon(req, body);
  }
}
