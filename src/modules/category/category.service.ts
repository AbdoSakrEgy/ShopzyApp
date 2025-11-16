import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/DB/models/category.model';
import { CreateCategorydDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  // =========================== create ===========================
  async create(
    req: any,
    parsedBody: CreateCategorydDto,
    file: Express.Multer.File,
  ) {
    const user = req.user;
    const { name, description, brands } = parsedBody;
    const image = file.filename;
    // step: check category existence
    const checkCategory = await this.categoryModel.findOne({ name });
    if (checkCategory) {
      return new ConflictException('Category already exist');
    }
    // step: create category
    const data: any = { ...parsedBody, createdBy: user._id };
    if (file) {
      data.image = image;
    }
    const category = await this.categoryModel.create(data);
    return { message: 'Category created successfully', result: category };
  }

  // =========================== findAll ===========================
  async findAll() {
    const categorys = await this.categoryModel.find();
    if (categorys.length == 0) {
      return { message: 'No categorys to view', result: [] };
    }
    return { message: 'Done', result: categorys };
  }

  // =========================== findOne ===========================
  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      return new NotFoundException('Category not found');
    }
    return { message: 'Done', result: { category } };
  }

  // =========================== update ===========================
  async update(
    req: any,
    id: string,
    parsedBody: UpdateCategoryDto,
    file: Express.Multer.File,
  ) {
    const user = req.user;
    const { name, description, brands } = parsedBody;
    // step: check category existence
    const checkCategory = await this.categoryModel.findById(id);
    if (!checkCategory) {
      return new ConflictException('Category not exist');
    }
    // step: update category
    const updateData: any = { name, description, updatedBy: user._id };
    if (file) {
      updateData.image = file.filename;
    }
    const updatedCategory = await this.categoryModel.updateOne(
      { _id: id },
      { $set: updateData, $addToSet: { brands: { $each: brands } } },
    );
    return {
      message: 'Category updated successfully',
      result: updatedCategory,
    };
  }

  // =========================== removeOne ===========================
  async removeOne(id: string) {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      return new NotFoundException('Category not found');
    }
    await this.categoryModel.deleteOne({ _id: id });
    return { message: 'Category removed successfully' };
  }
}
