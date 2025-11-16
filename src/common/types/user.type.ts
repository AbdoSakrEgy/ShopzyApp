import { HydratedDocument } from 'mongoose';
import { User } from 'src/DB/models/user.model';

export interface IUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  confirmEmail: Date;
  password: string;
  age: number;
  phone: string;
  role: RoleEnum;
  gender: GenderEnum;
  provider: ProviderEnum;
  credentialsChangedAt: Date;
  emailOtp: IOtp;
  passwordOtp: IOtp;
}

export interface IOtp {
  otp: string;
  expiredAt: Date;
}
export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  SELLER = 'seller',
}
export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}
export enum ProviderEnum {
  GOOGLE = 'google',
  SYSTEM = 'system',
}
export enum OtpTypeEnum {
  CONFIRMEMAIL = 'confirm email',
  RESETPASSWORD = 'reset password',
}
