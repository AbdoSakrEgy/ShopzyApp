import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/DB/models/product.model';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Category, categorySchema } from 'src/DB/models/category.model';
import { Brand, brandSchema } from 'src/DB/models/brand.model';
import { createClient } from 'redis';

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
  providers: [
    ProductService,
    JwtService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: 'redis://localhost:6379',
        });
        client.on('error', (err) => {
          console.log('Redis client err', err);
        });
        await client.connect();
        console.log('Redis connected');
        return client;
      },
    },
  ],
})
export class ProductModule {}
