import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from 'src/DB/models/brand.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  // =========================== create ===========================
  async create(parsedBody: CreateBrandDto, file: Express.Multer.File) {
    const { name, createdBy } = parsedBody;
    const image = file.filename;
    // step: check brand existence
    const checkBrand = await this.brandModel.findOne({ name });
    if (checkBrand) {
      return new ConflictException('Brand already exist');
    }
    // step: create brand
    const brand = await this.brandModel.create({
      name,
      createdBy,
      image,
    });
    return { message: 'Brand created successfully', result: brand };
  }

  // =========================== findAll ===========================
  async findAll() {
    const brands = await this.brandModel.find();
    if (brands.length == 0) {
      return { message: 'No brands to view', result: [] };
    }
    return { message: 'Done', result: brands };
  }

  // =========================== findOne ===========================
  async findOne(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      return new NotFoundException('Brand not found');
    }
    return { message: 'Done', result: { brand } };
  }

  // =========================== update ===========================
  async update(
    id: string,
    parsedBody: UpdateBrandDto,
    file: Express.Multer.File,
  ) {
    // step: check brand existence
    const checkBrand = await this.brandModel.findById(id);
    if (!checkBrand) {
      return new ConflictException('Brand not exist');
    }
    // step: update brand
    const updateData: any = { ...parsedBody };
    if (file) {
      updateData.image = file.filename;
    }
    const updatedBrand = await this.brandModel.updateOne(
      { _id: id },
      { $set: updateData },
    );
    return { message: 'Brand updated successfully', result: updatedBrand };
  }

  // =========================== removeOne ===========================
  async removeOne(id: string) {
    const brand = await this.brandModel.findOne({ _id: id });
    if (!brand) {
      return new NotFoundException('Brand not found');
    }
    await this.brandModel.deleteOne({ _id: id });
    return { message: 'Brand removed successfully' };
  }
}
