import z from 'zod';

export const confrimEmailSchema = z.strictObject({
  email: z.email(),
  otp: z.string(),
});

export type ConfrimEmailDto = z.infer<typeof confrimEmailSchema>;
