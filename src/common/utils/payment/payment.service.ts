import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  // Option1 (CheckoutSession)
  // createCheckoutSession
  async createCheckoutSession({
    success_url = process.env.SUCCESS_URL as string,
    cancel_url = process.env.CANCEL_URL as string,
    mode = 'payment',
    discounts = [],
    metadata = {},
    line_items,
    customer_email,
  }: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      success_url,
      cancel_url,
      line_items,
      mode,
      discounts,
      metadata,
    });
    return session;
  }

  // createCoupon
  async createCoupon(data: Stripe.CouponCreateParams) {
    const coupon = await this.stripe.coupons.create(data);
    return coupon;
  }

  // createRefund
  async createRefund(id: string) {
    const paymentIntent = await this.retrievePaymentIntent(id);
    if (!paymentIntent) throw new NotFoundException('Invalid paymentIntent id');
    const refund = await this.stripe.refunds.create({
      payment_intent: id,
    });
    return refund;
  }

  // Option2 (PaymentIntent)
  // createPaymentMethod
  async createPaymentMethod(data: Stripe.PaymentMethodCreateParams) {
    const paymentMethod = await this.stripe.paymentMethods.create(data);
    return paymentMethod;
  }
  // createPaymentIntent
  async createPaymentIntent(data: Stripe.PaymentIntentCreateParams) {
    const paymentIntent = await this.stripe.paymentIntents.create(data);
    return paymentIntent;
  }
  // retrievePaymentIntent
  async retrievePaymentIntent(id: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
    return paymentIntent;
  }
  // confirmPaymentIntent
  async confirmPaymentIntent(id: string) {
    const paymentIntent = await this.retrievePaymentIntent(id);
    if (!paymentIntent) throw new NotFoundException('Invalid paymentIntent id');
    const confirmPaymentIntent = await this.stripe.paymentIntents.confirm(id);
    return confirmPaymentIntent;
  }
}
