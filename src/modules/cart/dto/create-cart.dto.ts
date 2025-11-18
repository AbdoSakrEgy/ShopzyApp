import z from 'zod';

// cartItemSchema
export const cartItemSchema = z.strictObject({
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
});
export const createCartSchema = z.strictObject({
  items: z.array(cartItemSchema),
  totalPrice: z.number(),
  coupon: z.string().optional(),
  discount: z.number().default(0),
  totalPriceAfterDiscount: z.number().optional(),
});
export type CreateCartDto = z.infer<typeof createCartSchema>;

// addToCartSchema
export const addToCartSchema = z.strictObject({
  productId: z.string(),
  quantity: z.number(),
});
export type AddToCartDto = z.infer<typeof addToCartSchema>;

// updateCartProduct
export const updateCartProductSchema = z.strictObject({
  productId: z.string(),
  quantity: z.number(),
});
export type UpdateCartProductDto = z.infer<typeof updateCartProductSchema>;
