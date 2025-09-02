import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('place')
  async placeOrder(@Req() req: any, @Body() body: { amount: number }) {
    const user = req.user;
    if (!user) return { ok: false, message: 'Authenticated user required' };
    const amount = Number(body.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return { ok: false, message: 'Invalid amount' };
    }
    return this.ordersService.createOrder(user.userId, amount);
  }

  @Get('')
  async listOrders(@Req() req: any) {
    const user = req.user;
    return this.ordersService.getOrdersForUser(user.userId);
  }

  // helpful for legacy PHP
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    const data = await this.ordersService.getOrderById(orderId);
    if (!data) return { ok: false, message: 'Order not found' };
    return { ok: true, order: data };
  }
}
