import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ type: String, minlength: 3, maxlength: 100, required: true })
  name: string;

  @Prop({ type: String, minlength: 3, maxlength: 1000 })
  description: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: [String], required: true })
  images: [string];

  @Prop({ type: Number, required: true })
  originalPrice: number;

  @Prop({ type: Number, default: 0 })
  discountPresent: number;

  @Prop({ type: Number, required: true })
  salePrice: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: Number, default: 0 })
  soldItems: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
  brand: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = HydratedDocument<Product>;
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: productSchema },
]);
// hooks
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
productSchema.pre('updateOne', function (next) {
  const update = this.getUpdate() as UpdateQuery<Product>;
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
