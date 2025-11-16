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
  UseGuards,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { type CreateBrandDto, createBrandSchema } from './dto/create-brand.dto';
import { type UpdateBrandDto, updateBrandSchema } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { Types } from 'mongoose';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  create(
    @Req() req: any,
    @Body() body: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = createBrandSchema.parse(body);
    if (!file) {
      return new NotFoundException('File not found');
    }
    return this.brandService.create(req,parsedBody, file);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.brandService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = updateBrandSchema.parse(body);
    return this.brandService.update(req,id, parsedBody, file);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  removeOne(@Param('id') id: string) {
    return this.brandService.removeOne(id);
  }
}
