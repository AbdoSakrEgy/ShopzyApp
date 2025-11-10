import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { userSchema } from './DB/models/user.model';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env.dev',
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGOOSE_URI as string, {
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/auth/register');
  }
}
