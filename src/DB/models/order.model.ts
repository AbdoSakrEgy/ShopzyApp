import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatus,
} from 'src/common/types/order.type';
import { CartProduct } from './cart.model';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [CartProduct], default: [] })
  items: CartProduct[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  coupon: Types.ObjectId;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  discount: number;

  @Prop({ type: Number })
  totalPriceAfterDiscount: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatusEnum),
    default: OrderStatusEnum.PLACED,
  })
  status: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentMethodEnum),
    default: PaymentMethodEnum.CASH,
  })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  phone: string;

  @Prop({
    type: String,
  })
  checkoutSessionId: string;

  @Prop({
    type: String,
  })
  paymentIntentId: string;

  @Prop({
    type: String,
  })
  refundId: string;

  @Prop({
    type: Date,
  })
  refundedAt: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: orderSchema },
]);
