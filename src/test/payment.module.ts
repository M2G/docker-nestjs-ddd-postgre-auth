import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment';
import { OrdersModule } from './order.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
