import z from 'zod';

export const cartItemSchema = z.strictObject({
  productId: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  totalPrice: z.number().optional(),
});

export const updateCartSchema = z.strictObject({
  items: z.array(cartItemSchema).optional(),
  subTotalPrice: z.number().optional(),
  coupon: z.string().optional().optional(),
  discount: z.number().default(0).optional(),
  totalPriceAfterdiscount: z.number().optional(),
});

export type UpdateCartDto = z.infer<typeof updateCartSchema>;
