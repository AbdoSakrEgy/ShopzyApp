import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from 'src/DB/models/order.model';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Cart, cartSchema } from 'src/DB/models/cart.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: User.name, schema: userSchema },
      { name: Cart.name, schema: cartSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
