import z from 'zod';

export const registerSchema = z
  .strictObject({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.password != val.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: `password not equal confirmPassword.`,
        input: val,
      });
    }
  });
