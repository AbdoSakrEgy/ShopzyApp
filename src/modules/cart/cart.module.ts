import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Cart, cartSchema } from 'src/DB/models/cart.model';
import { Product, productSchema } from 'src/DB/models/product.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: cartSchema },
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
