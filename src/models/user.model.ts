import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    min: 3,
    max: 10,
    required: [true, 'firstName is required'],
  })
  firstName: string;

  @Prop({
    type: String,
    min: 3,
    max: 10,
    required: true,
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    set: function () {},
  })
  password: string;
}

const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async (next) => {});

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
