import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { OtpTypeEnum } from 'src/common/types/user.type';
import { hash } from 'src/common/utils/security/hash.utils';

@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  image: string;
}

export const brandSchema = SchemaFactory.createForClass(Brand);
export type BrandDocument = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: brandSchema },
]);
// hooks
brandSchema.pre('save', async function (next) {
  console.log('modifyedddddddddddddddd');
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
brandSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as UpdateQuery<Brand>;
  // handle both direct updates and $set
  const name = update?.name || update?.$set?.name;
  if (name) {
    const slug = slugify(name, { lower: true });
    if (update.name) {
      update.slug = slug;
    } else if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.$set = { slug };
    }
  }
  next();
});
