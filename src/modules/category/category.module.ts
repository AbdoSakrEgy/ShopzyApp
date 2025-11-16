import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from 'src/DB/models/category.model';
import { JwtService } from '@nestjs/jwt';
import { User, userSchema } from 'src/DB/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
})
export class CategoryModule {}
