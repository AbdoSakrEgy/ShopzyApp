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
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { type CreateBrandDto, createBrandSchema } from './dto/create-brand.dto';
import { type UpdateBrandDto, updateBrandSchema } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { Types } from 'mongoose';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  create(
    @Body() body: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = createBrandSchema.parse(body);
    if (!file) {
      return new NotFoundException('File not found');
    }
    return this.brandService.create(parsedBody, file);
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
    @Body() body: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = updateBrandSchema.parse(body);
    return this.brandService.update(id, parsedBody, file);
  }

  @Delete('/remove-one/:id')
  removeOne(@Param('id') id: string) {
    return this.brandService.removeOne(id);
  }
}
