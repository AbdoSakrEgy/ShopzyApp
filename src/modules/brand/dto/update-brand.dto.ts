import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsMongoId, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsString()
  @Length(3, 10)
  name?: string;

  @IsString()
  image?: string;

  @IsMongoId()
  createdBy?: Types.ObjectId;
}
