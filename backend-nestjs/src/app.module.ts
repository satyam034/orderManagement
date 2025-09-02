import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  controllers: [AuthController, OrdersController],
  providers: [AuthService, OrdersService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('orders');
  }
}
