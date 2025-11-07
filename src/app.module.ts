import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env.dev',
    }),
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/shopzy', {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('DB connected'));
        connection.on('open', () => console.log('DB open'));
        connection.on('disconnected', () => console.log('DB disconnected'));
        connection.on('reconnected', () => console.log('DB reconnected'));
        connection.on('disconnecting', () => console.log('DB disconnecting'));

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
