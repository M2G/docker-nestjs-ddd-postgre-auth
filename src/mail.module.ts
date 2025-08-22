import { Module } from '@nestjs/common';
// import { MailService } from '@domain/services';
// import { MailRepository } from '@infrastructure/repository';
import MailRepository from '@infrastructure/repository/mail/mail.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import MailService from '@domain/services/mail/mail.service';

//@see https://ethereal.email/create
@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
       // host: process.env.MAIL_HOST,
        host: 'smtp.ethereal.email',
        auth: {
          user: 'geoffrey.harvey65@ethereal.email',
          pass: '3yYtyRRRrpUYn5D6CM'
          //user: process.env.MAIL_USERNAME,
          //pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [MailRepository, MailService],
})
export default class MailModule {}
