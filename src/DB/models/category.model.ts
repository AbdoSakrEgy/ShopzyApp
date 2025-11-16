import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({ type: String, minlength: 3, maxlength: 1000 })
  description: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }] })
  brands: Types.ObjectId[];
}

export const categorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = HydratedDocument<Category>;
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: categorySchema },
]);
// hooks
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
categorySchema.pre('updateOne', function (next) {
  const update = this.getUpdate() as UpdateQuery<Category>;
  // handle both direct updates and $set
  const name: string = update?.name || update?.$set?.name;
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
