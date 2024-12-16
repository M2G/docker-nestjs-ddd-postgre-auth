import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}
}
