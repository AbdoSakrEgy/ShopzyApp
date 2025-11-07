import { UserModel } from './../models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { registerDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  // =========================== sayHello ===========================
  async sayHello(body: registerDTO) {
    const data = await this.UserModel.find();
    console.log({ data });
    return 'hello';
  }
}
