import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class registerDTO {
  @IsString()
  @Length(3, 10)
  userName: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  // @IsStrongPassword()
  password: string;
  @IsString()
  confirmPassword: string;
}
