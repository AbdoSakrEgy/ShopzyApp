// import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

// export class RegisterDTO {
//   @IsString()
//   @Length(3, 10)
//   userName: string;
//   @IsString()
//   @IsEmail()
//   email: string;
//   @IsString()
//   // @IsStrongPassword()
//   password: string;
//   @IsString()
//   confirmPassword: string;
// }

import { GenderEnum, ProviderEnum, RoleEnum } from 'src/common/types/user.type';
import z from 'zod';

export const registerSchema = z.strictObject({
  firstName: z.string().min(3).max(10).optional(),
  lastName: z.string().min(3).max(10).optional(),
  userName: z.string().min(3).max(27),
  email: z.email(),
  password: z.string().min(3).max(20).optional(),
  age: z.number().min(16).optional(),
  phone: z
    .string()
    .refine((value) => {
      const phoneRegex = /^(\+20|0)?1[0125][0-9][8]$/;
      return phoneRegex.test(value);
    })
    .optional(),
  role: z.enum(Object.values(RoleEnum)).default(RoleEnum.USER).optional(),
  gender: z.enum(Object.values(GenderEnum)).default(GenderEnum.MALE).optional(),
  provider: z
    .enum(Object.values(ProviderEnum))
    .default(ProviderEnum.SYSTEM)
    .optional(),
  credentialsChangedAt: z.date().optional(),
  emailOtp: z.object().optional(),
  passwordOtp: z.object().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
