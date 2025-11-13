import { UserDocument, UserModel } from '../../DB/models/user.model';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { type RegisterDto } from './dto/register.dto';
import { createOtp } from 'src/common/utils/create.otp';
import { sendEmail } from 'src/common/utils/sendEmail/send.email';
import { template } from 'src/common/utils/sendEmail/generateHTML';
import { OtpTypeEnum } from 'src/common/types/user.type';
import { Otp, OtpDocument } from 'src/DB/models/otp.model';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ConfrimEmailDto } from './dto/confirmEmail.dto';
import { compare } from 'src/common/utils/security/hash.utils';
import { LoginDto } from './dto/login.dto';
import { createJwt } from 'src/common/utils/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}
  // =========================== register ===========================
  async register(body: RegisterDto) {
    const { firstName, email } = body;
    // step: check user existence
    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) {
      throw new ConflictException('User already exist');
    }
    // step: send email otp
    const otpCode = createOtp();
    const { isEmailSended, info } = await sendEmail({
      to: email,
      subject: 'shopzyApp',
      html: template({
        otpCode,
        receiverName: firstName || '',
        subject: OtpTypeEnum.CONFIRMEMAIL,
      }),
    });
    if (!isEmailSended) {
      throw new BadRequestException('Error while sending email');
    }
    // step: create user
    const user = await this.userModel.create(body);
    // step: create otp
    await this.otpModel.create({
      code: otpCode,
      expiredAt: new Date(Date.now() + 3 * 60 * 1000),
      createdBy: user._id,
      type: OtpTypeEnum.CONFIRMEMAIL,
    });
    // step: create tokens
    const accessToken = createJwt(
      { userId: user._id, userEmail: user.email },
      process.env.ACCESS_SECRET_KEY as string,
      {
        expiresIn: '1h',
        jwtid: createOtp(),
      },
    );
    const refreshToken = createJwt(
      { userId: user._id, userEmail: user.email },
      process.env.REFRESH_SECRET_KEY as string,
      {
        expiresIn: '7d',
        jwtid: createOtp(),
      },
    );
    return {
      message: 'User created successfully',
      result: { accessToken, refreshToken },
    };
  }

  // =========================== resendOtp ===========================
  async resendOtp(body: ResendOtpDto) {
    const { email, otpType } = body;
    // step: check user existence
    const checkUser = await this.userModel.findOne({
      email,
      confirmEmail: { $exists: false },
    });
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    // step: check otp existence
    const checkOtop = await this.otpModel.findOne({
      createdBy: checkUser._id,
      type: otpType,
    });
    if (checkOtop) {
      throw new BadRequestException('OTP not expired yet');
    }
    // step: send email otp
    const otpCode = createOtp();
    const { isEmailSended, info } = await sendEmail({
      to: email,
      subject: 'shopzyApp',
      html: template({
        otpCode,
        receiverName: checkUser.firstName,
        subject: OtpTypeEnum.CONFIRMEMAIL,
      }),
    });
    if (!isEmailSended) {
      throw new BadRequestException('Error while sending email');
    }
    // step: create otp
    await this.otpModel.create({
      code: otpCode,
      expiredAt: new Date(Date.now() + 3 * 60 * 1000),
      createdBy: checkUser._id,
      type: otpType,
    });
    return { message: 'OTP sent to email successfully' };
  }

  // =========================== confrimEmail ===========================
  async confrimEmail(body: ConfrimEmailDto) {
    const { email, otp } = body;
    // step: check user existence
    const checkUser = await this.userModel.findOne({
      email,
      confirmEmail: { $exists: false },
    });
    if (!checkUser) {
      throw new NotFoundException('User not found or email already confirmed');
    }
    // step: check otp existence
    const checkOtp = await this.otpModel.findOne({
      createdBy: checkUser._id,
      type: OtpTypeEnum.CONFIRMEMAIL,
    });
    if (!checkOtp) {
      throw new NotFoundException('OTP invalid');
    }
    // step: check otp
    if (!(await compare(otp, checkOtp.code))) {
      throw new BadRequestException('Invalid otp');
    }
    // step: confirm email
    await this.userModel.updateOne(
      { email },
      { $set: { confirmEmail: new Date() } },
    );
    return { message: 'User confirmed successfully' };
  }

  // =========================== login ===========================
  async login(body: LoginDto) {
    const { email, password } = body;
    // step: check user existence
    const checkUser = await this.userModel.findOne({ email });
    if (!checkUser) {
      throw new BadRequestException('Invalid credentials');
    }
    // step: check password
    if (!(await compare(password, checkUser.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    // step: create tokens
    const accessToken = createJwt(
      { userId: checkUser._id, userEmail: checkUser.email },
      process.env.ACCESS_SECRET_KEY as string,
      {
        expiresIn: '1h',
        jwtid: createOtp(),
      },
    );
    const refreshToken = createJwt(
      { userId: checkUser._id, userEmail: checkUser.email },
      process.env.REFRESH_SECRET_KEY as string,
      {
        expiresIn: '7d',
        jwtid: createOtp(),
      },
    );
    return {
      message: 'User loggedin successfully',
      result: { accessToken, refreshToken },
    };
  }

  // =========================== profile ===========================
  profile(req: any) {
    const user = req.user;
    return { message: 'Done', result: { user } };
  }
}
