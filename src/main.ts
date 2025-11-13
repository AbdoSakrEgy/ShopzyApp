import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards();
  // app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 5000, () => {
    console.log('Server is running on port', process.env.PORT);
    console.log('==================================');
  });
}
bootstrap();
