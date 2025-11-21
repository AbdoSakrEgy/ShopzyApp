import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from 'src/DB/models/user.model';
import { verifyJwt } from '../utils/jwt';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from './auth/socket.auth.guard';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'public' })
export class RealTimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('event1')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log({ data });
    client.emit('IsRecievedEvent', 'Data recieved successfully');
    return data;
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
