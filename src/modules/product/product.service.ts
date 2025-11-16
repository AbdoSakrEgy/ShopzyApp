import { BrandDocument, BrandModel } from './../../DB/models/brand.model';
import {
  CategoryDocument,
  CategoryModel,
} from './../../DB/models/category.model';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/DB/models/product.model';
import { Model } from 'mongoose';
import { Category } from 'src/DB/models/category.model';
import { Brand } from 'src/DB/models/brand.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<CategoryDocument>,
    @InjectModel(Brand.name)
    private readonly BrandModel: Model<BrandDocument>,
  ) {}

  // =========================== create ===========================
  async create(
    req: any,
    parsedBody: CreateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const user = req.user;
    // step: check category existence
    if (parsedBody.category) {
      const checkCategory = await this.CategoryModel.findById(
        parsedBody.category,
      );
      if (!checkCategory) {
        return new NotFoundException('Category not found');
      }
    }
    // step: check bran existence
    if (parsedBody.brand) {
      const checkBrand = await this.BrandModel.findById(parsedBody.brand);
      if (!checkBrand) {
        return new NotFoundException('Brand not found');
      }
    }
    // step: create product
    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images?.push(file.filename);
      }
    }
    const product = await this.productModel.create({
      ...parsedBody,
      images,
      createdBy: user._id,
    });
    return { message: 'Product created successfulyy', result: { product } };
  }
  // =========================== findAll ===========================
  async findAll() {
    const products = await this.productModel.find();
    return { message: 'Done', result: { products } };
  }

  // =========================== findOne ===========================
  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    return { message: 'Done', result: { product } };
  }

  // =========================== update ===========================
  async update(
    req: any,
    id: string,
    parsedBody: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const user = req.user;
    // step: check product existence
    const checkProduct = await this.productModel.findById(id);
    if (!checkProduct) {
      return new ConflictException('Product not found');
    }
    // step: update product
    const updateData: any = { ...parsedBody, updatedBy: user._id };
    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images?.push(file.filename);
      }
    }
    if (files) {
      updateData.images = images;
    }
    const updatedProduct = await this.productModel.updateOne(
      { _id: id },
      { $set: updateData, $addToSet: { images: { $each: images } } },
    );
    return {
      message: 'Product updated successfully',
      result: updatedProduct,
    };
  }

  // =========================== removeOne ===========================
  async removeOne(id: string) {
    // step: check product existence
    const product = await this.productModel.findById(id);
    if (!product) {
      return new NotFoundException('Product not found');
    }
    await this.productModel.deleteOne({ _id: id });
    return { message: 'Product removed successfully' };
  }
}
