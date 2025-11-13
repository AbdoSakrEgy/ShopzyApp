import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';

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

  @Get('/profile')
  @UseGuards(AuthGuard)
  profile(@Req() req: any) {
    return this.authService.profile(req);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return 'hello';
  }

  @Post('/upload-files')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions()))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return 'hello';
  }
}
