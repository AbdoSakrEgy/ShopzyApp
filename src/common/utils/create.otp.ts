import { customAlphabet } from 'nanoid';

export const createOtp = (): string => {
  const generate = customAlphabet('0123456', 6);
  const otp: string = generate();
  return otp;
};
