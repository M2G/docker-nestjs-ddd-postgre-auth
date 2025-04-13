import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from 'src/generated/i18n.generated';

export type SupportedLang = 'en' | 'ar';
export const supportedLangs: SupportedLang[] = ['en', 'ar'];
export const defaultLang: SupportedLang = 'en';

@Injectable()
class YcI18nService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  t(key: string, options?: Record<string, any>) {
    return this.i18n.translate(key as PathImpl2<I18nTranslations>, {
      lang: this.lang(),
      ...options,
    });
  }

  lang(): SupportedLang {
    return (I18nContext.current()?.lang || defaultLang) as SupportedLang;
  }
}

export default YcI18nService;
