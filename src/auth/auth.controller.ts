import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './dto/register.dto';
import { CheckPassword } from 'src/common/pipes/checkPassword.pipe';
import { Abdo } from 'src/common/pipes/abdo.pipe';
import { registerSchema } from './validation/register.zod';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('say-hello')
  @UsePipes(new ZodValidationPipe(registerSchema))
  sayHello(
    @Body() body: registerDTO,
    @Param() param: any,
    @Query() query: any,
  ) {
    console.log({ body });
    return this.authService.sayHello(body);
  }
}
