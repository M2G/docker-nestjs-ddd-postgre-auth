import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './order';
import { PaymentModule } from './payment.module';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  controllers: [],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
