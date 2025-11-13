import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User, UserDocument } from 'src/DB/models/user.model';
import { verifyJwt } from '../utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith(process.env.BEARER_KEY)) {
      throw new UnauthorizedException('Missing authorization header part');
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyJwt({
      token,
      privateKey: process.env.ACCESS_SECRET_KEY as string,
    });
    const user = await this.userModel.findOne({ _id: payload.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    request.user = user;
    return true;
  }
}
