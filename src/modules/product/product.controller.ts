import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  type CreateProductDto,
  createProductSchema,
} from './dto/create-product.dto';
import {
  updateProductSchema,
  type UpdateProductDto,
} from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions()))
  create(
    @Req() req: any,
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const parsedBody = createProductSchema.parse(body);
    if (!files || files.length == 0) {
      return new NotFoundException('Images not found');
    }
    return this.productService.create(req, parsedBody, files);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.productService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions()))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const parsedBody = updateProductSchema.parse(body);
    return this.productService.update(req, id, parsedBody, files);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  removeOne(@Param('id') id: string) {
    return this.productService.removeOne(id);
  }
}
