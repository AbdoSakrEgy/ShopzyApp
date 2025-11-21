import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { RealTimeGateway } from './gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [],
  providers: [RealTimeGateway, JwtService],
})
export class GatewayModule {}
