import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { registerSchema, type RegisterDto } from './dto/register.dto';
import { type ResendOtpDto, resendOtpSchema } from './dto/resendOtp.dto';
import {
  type ConfrimEmailDto,
  confrimEmailSchema,
} from './dto/confirmEmail.dto';
import { type LoginDto, loginSchema } from './dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/resend-otp')
  @UsePipes(new ZodValidationPipe(resendOtpSchema))
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.authService.resendOtp(body);
  }

  @Post('/confirm-email')
  @UsePipes(new ZodValidationPipe(confrimEmailSchema))
  async confirmEmail(@Body() body: ConfrimEmailDto) {
    return await this.authService.confrimEmail(body);
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
