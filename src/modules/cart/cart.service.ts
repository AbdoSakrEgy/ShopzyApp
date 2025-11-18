import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
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
    // step: cart not exist
    const checkCart = await this.cartModel.findOne({ user: user._id });
    if (!checkCart) {
      const cart = await this.cartModel.create({
        user,
        items: [{ productId, quantity, price, total }],
        totalPrice: total,
      });
      return { message: 'Items added successfully', result: { cart } };
    }
    // step: cart is exist
    // step: check item existence
    const itemIndex = checkCart.items.findIndex(
      (item) => item.productId.toString() == productId,
    );
    if (itemIndex > -1) {
      checkCart.items[itemIndex].quantity += quantity;
      checkCart.items[itemIndex].total =
        checkCart.items[itemIndex].quantity * checkCart.items[itemIndex].price;
      checkCart.totalPrice = checkCart.items.reduce(
        (sum, item) => sum + item.total,
        0,
      );
    } else {
      checkCart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        price,
        total,
      });
      checkCart.totalPrice = checkCart.items.reduce(
        (sum, item) => sum + item.total,
        0,
      );
    }
    await checkCart.save();
    return { message: 'Items added successfully', result: { cart: checkCart } };
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
}
