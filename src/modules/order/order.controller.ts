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
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orderService.create(req, body);
  }

  @Get('/find-one/:orderId')
  findOne(@Param('orderId') orderId: string) {
    return this.orderService.findOne(orderId);
  }

  @Patch('/update/:orderId')
  update(@Param('orderId') orderId: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(orderId, body);
  }

  @Delete('/cancle/:orderId')
  cancle(@Param('orderId') orderId: string) {
    return this.orderService.cancle(orderId);
  }
}
