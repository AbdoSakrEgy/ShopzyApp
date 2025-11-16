import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, brandSchema } from 'src/DB/models/brand.model';
import { JwtService } from '@nestjs/jwt';
import { User, userSchema } from 'src/DB/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Brand.name, schema: brandSchema },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService, JwtService],
})
export class BrandModule {}
