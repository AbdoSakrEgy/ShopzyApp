import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { CategoryService } from './category.service';
import {
  createCategorySchema,
  type CreateCategorydDto,
} from './dto/create-category.dto';
import {
  updateCategorySchema,
  type UpdateCategoryDto,
} from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  create(
    @Req() req: any,
    @Body() body: CreateCategorydDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = createCategorySchema.parse(body);
    return this.categoryService.create(req, parsedBody, file);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const parsedBody = updateCategorySchema.parse(body);
    return this.categoryService.update(req, id, parsedBody, file);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  removeOne(@Param('id') id: string) {
    return this.categoryService.removeOne(id);
  }
}
