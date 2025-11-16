import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/DB/models/product.model';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Category, categorySchema } from 'src/DB/models/category.model';
import { Brand, brandSchema } from 'src/DB/models/brand.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
      { name: Category.name, schema: categorySchema },
      { name: Brand.name, schema: brandSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
