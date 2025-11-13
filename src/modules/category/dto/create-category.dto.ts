import { IsArray, IsMongoId, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @Length(3, 10)
  name: string;

  @IsString()
  image: string;

  @IsMongoId()
  createdBy: Types.ObjectId;
}
