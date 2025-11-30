import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { type CreateOrderDto } from './dto/create-order.dto';
import { type UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orderService.create(req, body);
  }

  @Post('/pay-with-stripe/:orderId')
  @UseGuards(AuthGuard)
  payWithStripe(@Req() req: any, @Param('orderId') orderId: string) {
    return this.orderService.payWithStripe(req, orderId);
  }

  @Post('/web-hook-with-stripe')
  webHookWithStripe(@Body() body: any) {
    // console.log({ body });
    return this.orderService.webHookWithStripe(body);
  }

  @Post('/refund-with-stripe/:orderId')
  @UseGuards(AuthGuard)
  refundWithStripe(@Req() req: any, @Param('orderId') orderId: string) {
    return this.orderService.refundWithStripe(req, orderId);
  }
}
