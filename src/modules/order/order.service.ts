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
import { UserDocument } from 'src/DB/models/user.model';
import { PaymentService } from 'src/common/utils/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  // =========================== create ===========================
  async create(req: any, body: CreateOrderDto) {
    const user = req.user;
    const { address, phone, paymentMethod } = body;
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
      paymentMethod,
      address,
      phone,
    });
    // step: clear cart
    await this.cartModel.deleteOne({ _id: cart._id });
    return { message: 'Order created successfully', result: { order } };
  }

  // =========================== payWithStripe ===========================
  async payWithStripe(req: any, orderId: string) {
    const user = req.user;
    // step: check order existence
    const order = await this.orderModel
      .findOne({
        _id: orderId,
        user: user._id,
        status: OrderStatusEnum.PLACED,
        paymentMethod: PaymentMethodEnum.CARD,
      })
      .populate('user')
      .populate('coupon');
    if (!order) throw new NotFoundException('Order not found');
    // step: collect createCheckoutSession data
    const amount = order.totalPriceAfterDiscount ?? order.totalPrice ?? 0;
    const line_items = [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order ${(order.user as unknown as UserDocument).firstName}`,
            description: `Payment for order on address ${order.address}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ];
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (order.discount) {
      const coupon = await this.paymentService.createCoupon({
        duration: 'once',
        currency: 'egp',
        percent_off: order.discount,
      });
      discounts.push({ coupon: coupon.id });
    }
    // step: apply stripe services
    // createCheckoutSession
    const checkoutSession = await this.paymentService.createCheckoutSession({
      customer_email: (order.user as unknown as UserDocument).email,
      line_items,
      mode: 'payment',
      discounts,
      metadata: { orderId: orderId.toString() },
    });
    // createPaymentIntent
    const paymentMethod = await this.paymentService.createPaymentMethod({
      type: 'card',
      card: { token: 'tok_visa' },
    });
    // createPaymentIntent
    const paymentIntent = await this.paymentService.createPaymentIntent({
      amount: order.totalPriceAfterDiscount * 100,
      currency: 'egp',
      payment_method: paymentMethod.id,
      payment_method_types: [PaymentMethodEnum.CARD],
    });
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    // confirmPaymentIntent
    await this.paymentService.confirmPaymentIntent(paymentIntent.id);
    return checkoutSession;
  }

  // =========================== refundWithStripe ===========================
  async refundWithStripe(req: any, orderId: string) {
    const user = req.user;
    // step: check order existence
    const order = await this.orderModel
      .findOne({
        _id: orderId,
        user: user._id,
        status: OrderStatusEnum.PLACED,
        paymentMethod: PaymentMethodEnum.CARD,
      })
      .populate('user')
      .populate('coupon');
    if (!order) throw new NotFoundException('Order not found');
    // step: check order paymentIntent existence
    if (!order.paymentIntentId)
      throw new NotFoundException('PaymentIntent not found');
    // step: apply stripe services
    // createRefund
    const refund = await this.paymentService.createRefund(
      order.paymentIntentId,
    );
    // step: update order
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        status: OrderStatusEnum.CANCELLED,
        refundId: refund.id,
        refundedAt: new Date(),
        $unset: { paymentIntentId: true },
        $inc: { __v: 1 },
      },
      { new: true },
    );
    return {
      message: 'Order updated successfully',
      result: { order: updatedOrder },
    };
  }
}
