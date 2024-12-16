import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OrdersService } from './order';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}
}
