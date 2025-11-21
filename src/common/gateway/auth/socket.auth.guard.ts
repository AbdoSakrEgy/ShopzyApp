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
import { User } from 'src/DB/models/user.model';
import { Socket } from 'socket.io';
import { verifyJwt } from 'src/common/utils/jwt';

export interface ISocketWithUser extends Socket {
  user: User;
}
@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing authorization header');
    const payload = verifyJwt({
      token: authHeader,
      privateKey: process.env.ACCESS_SECRET_KEY as string,
    });
    const user = await this.userModel.findById(payload.userId);
    if (!user) throw new NotFoundException('User not found');
    (client as ISocketWithUser).user = user;
    return true;
  }
}
