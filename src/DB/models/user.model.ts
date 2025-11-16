import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  GenderEnum,
  type IOtp,
  IUser,
  ProviderEnum,
  RoleEnum,
} from 'src/common/types/user.type';
import { hash } from 'src/common/utils/security/hash.utils';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
    required: [true, 'firstName is required'],
  })
  firstName: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
    required: true,
  })
  lastName: string;

  @Virtual({
    get: function (this: HydratedDocument<User>) {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (this: HydratedDocument<User>, value: string) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  userName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: Date })
  confirmEmail: Date;

  @Prop({ type: Object })
  emailOtp: IOtp;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    required: function (this: HydratedDocument<User>) {
      return this.provider == ProviderEnum.SYSTEM ? true : false;
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum;

  @Prop({ type: Number, minlength: 16 })
  age: number;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, enum: Object.values(RoleEnum), default: RoleEnum.USER })
  role: RoleEnum;

  @Prop({
    type: String,
    enum: Object.values(GenderEnum),
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Prop({ type: Date })
  credentialsChangedAt: Date;

  @Prop({ type: Object })
  passwordOtp: IOtp;
}

export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
// hooks
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});
