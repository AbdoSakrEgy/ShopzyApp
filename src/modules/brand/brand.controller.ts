import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { Types } from 'mongoose';

@Controller('/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  create(
    @Body('name') name: string,
    @Body('createdBy') createdBy: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createBrandDto = {
      name,
      createdBy,
      image: file.filename,
    };
    return this.brandService.create(createBrandDto);
  }

  @Get('/find-all')
  findAll() {
    return this.brandService.findAll();
  }

  @Get('/find-one/:id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('createdBy') createdBy: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateBrandDto = {
      name,
      createdBy,
      image: file.filename,
    };
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
