import { Module } from '@nestjs/common';
// import { MailService } from '@domain/services';
// import { MailRepository } from '@infrastructure/repository';
import MailRepository from '@infrastructure/repository/mail/mail.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import MailService from '@domain/services/mail/mail.service';

@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [MailRepository, MailService],
})
export default class MailModule {}
