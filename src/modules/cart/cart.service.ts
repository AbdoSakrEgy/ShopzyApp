import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddToCartDto,
  CreateCartDto,
  UpdateCartProductDto,
} from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from 'src/DB/models/cart.model';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/DB/models/product.model';
import { CreateCouponDto } from '../coupon/dto/create-coupon.dto';
import { Coupon, CouponDocument } from 'src/DB/models/coupon.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  // =========================== addToCart ===========================
  async addToCart(req: any, body: AddToCartDto) {
    const user = req.user;
    const { productId, quantity } = body;
    // step: check product existence
    const checkProduct = await this.productModel.findById(productId);
    if (!checkProduct) {
      throw new NotFoundException('Product not found');
    }
    // step: check user cart existence
    const price = checkProduct.salePrice;
    const total = price * quantity;
    // step: if cart not exist
    const cart = await this.cartModel.findOne({ user: user._id });
    if (!cart) {
      const cart = await this.cartModel.create({
        user,
        items: [{ productId, quantity, price, total }],
        totalPrice: total,
      });
      return { message: 'Items added successfully', result: { cart } };
    }
    // step: if cart exist
    // step: check item existence
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() == productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        price,
        total,
      });
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    }
    await cart.save();
    return { message: 'Items added successfully', result: { cart: cart } };
  }

  // =========================== getCart ===========================
  async getCart(req: any) {
    const user = req.user;
    // step: check cart existence
    const checkCart = await this.cartModel
      .findOne({ user: user._id })
      .populate({
        path: 'items.productId',
        select: 'name description salePrice images slug -_id',
      });
    if (!checkCart) {
      throw new NotFoundException('Cart not found');
    }
    return { message: 'Done', result: { cart: checkCart } };
  }

  // =========================== updateCartProduct ===========================
  async updateCartProduct(req: any, body: UpdateCartProductDto) {
    const user = req.user;
    const { productId, quantity } = body;
    // step: check cart existence
    const checkCart = await this.cartModel.findOne({ user: user._id });
    if (!checkCart) {
      throw new NotFoundException('Cart not found');
    }
    // step: check item existence
    const itemIndex = checkCart.items.findIndex(
      (item) => item.productId.toString() == productId,
    );
    if (itemIndex == -1) {
      throw new NotFoundException('Product not found in cart');
    }
    if (quantity <= 0) {
      checkCart.items.splice(itemIndex, 1);
    } else {
      const item = checkCart.items[itemIndex];
      item.quantity = quantity;
      item.total = item.price * item.quantity;
    }
    checkCart.totalPrice = checkCart.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    await checkCart.save();
    return {
      message: 'Cart updated successfully',
      result: { cart: checkCart },
    };
  }

  // =========================== removeCartProduct ===========================
  async removeCartProduct(req: any, productId: string) {
    const user = req.user;
    // step: check cart existence
    const checkCart = await this.cartModel.findOne({ user: user._id });
    if (!checkCart) {
      throw new NotFoundException('Cart not found');
    }
    // step: check item existence
    const itemIndex = checkCart.items.findIndex(
      (item) => item.productId.toString() == productId,
    );
    if (itemIndex == -1) {
      throw new NotFoundException('Product not found in cart');
    }
    checkCart.items.splice(itemIndex, 1);
    checkCart.totalPrice = checkCart.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    await checkCart.save();
    return { message: 'Item removed from cart successfully', result: {} };
  }

  // =========================== applyCoupon ===========================
  async applyCoupon(req: any, body: CreateCouponDto) {
    const user = req.user;
    const { code } = body;
    // step: check cart existence
    const checkCart = await this.cartModel.findOne({ user });
    if (!checkCart) {
      throw new NotFoundException('Cart not found');
    }
    // step: check coupon existence
    const checkCoupon = await this.couponModel.findOne({ code });
    if (!checkCoupon) {
      throw new NotFoundException('Coupon not found');
    }
    // step: check coupon expire date
    const now = new Date();
    if (checkCoupon.expiresAt < now) {
      throw new BadRequestException('Coupon has expired');
    }
    // step: apply coupon
    const discountAmount =
      (checkCart.totalPrice * checkCoupon.discountPrecent) / 100;
    const totalAfterDiscount = checkCart.totalPrice - discountAmount;
    checkCart.coupon = checkCoupon._id;
    checkCart.discount = checkCoupon.discountPrecent;
    checkCart.totalPriceAfterDiscount = totalAfterDiscount;
    await checkCart.save();
    return {
      message: 'Coupon applied successfully',
      result: { cart: checkCart },
    };
  }
}
