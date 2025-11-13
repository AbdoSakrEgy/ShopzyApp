import { IsString, IsInt, Length, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBrandDto {
  @IsString()
  @Length(3, 10)
  name: string;

  @IsString()
  image: string;

  @IsMongoId()
  createdBy: Types.ObjectId;
}
