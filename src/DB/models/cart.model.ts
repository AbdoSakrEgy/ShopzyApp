import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';

@Schema({ timestamps: true })
export class CartProduct {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Types.ObjectId;
  @Prop({ type: Number, required: true })
  quantity: number;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Number, required: true })
  total: number;
}

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({ type: [CartProduct], default: [] })
  items: CartProduct[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  coupon: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number })
  totalPriceAfterDiscount: number;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = HydratedDocument<Cart>;
export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: cartSchema },
]);
