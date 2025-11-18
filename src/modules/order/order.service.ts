import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/DB/models/order.model';
import { Model } from 'mongoose';
import { Cart, CartDocument } from 'src/DB/models/cart.model';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
} from 'src/common/types/order.type';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  // =========================== create ===========================
  async create(req: any, body: CreateOrderDto) {
    const user = req.user;
    const { address, phone } = body;
    const cart = await this.cartModel.findOne({ user }).populate('coupon');
    // step: check cart existence
    if (!cart || cart?.items.length < 0) {
      throw new NotFoundException('Cart is empty');
    }
    // step: create order
    const order = await this.orderModel.create({
      user,
      items: cart.items,
      totalPrice: cart.totalPrice,
      coupon: cart.coupon._id,
      discount: cart.discount || 0,
      totalPriceAfterDiscount: cart.totalPriceAfterDiscount || cart.totalPrice,
      status: OrderStatusEnum.PLACED,
      paymentMethod: PaymentMethodEnum.CASH,
      address,
      phone,
    });
    // step: clear cart
    cart.items = [];
    await cart.save();
    return { message: 'Order created successfully', result: { order } };
  }

  // =========================== findOne ===========================
  async findOne(orderId: string) {
    const order = await this.orderModel.findById(orderId);
  }

  // =========================== update ===========================
  update(orderId: string, body: UpdateOrderDto) {}

  // =========================== cancle ===========================
  cancle(orderId: string) {}
}
