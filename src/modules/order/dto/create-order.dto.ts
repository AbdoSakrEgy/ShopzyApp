import { PaymentMethodEnum } from 'src/common/types/order.type';
import z from 'zod';

// createOrderSchema
const phoneE164Regex = /^\+?[1-9]\d{6,14}$/;
export const createOrderSchema = z.strictObject({
  paymentMethod: z.enum(Object.values(PaymentMethodEnum)),
  address: z.string().min(1, 'Address is required'),
  phone: z
    .string()
    .min(7, 'Phone must be at least 7 characters')
    .max(16, 'Phone must be at most 16 characters')
    .regex(
      phoneE164Regex,
      'Phone must be in international format (E.164) or digits only',
    ),
});
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
