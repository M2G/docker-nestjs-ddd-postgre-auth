import { Global, Module } from '@nestjs/common';
import YcI18nService from '@domain/services/yc-i18n';

@Global()
@Module({
  exports: [YcI18nService],
  providers: [YcI18nService],
})
export class YcI18nModule {}
