import z from 'zod';

// createCouponSchema
export const createCouponSchema = z.strictObject({
  code: z.string(),
});
export type CreateCouponDto = z.infer<typeof createCouponSchema>;
