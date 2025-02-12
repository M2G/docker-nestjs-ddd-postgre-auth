import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
class MailRepository {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(mail) {
    return this.mailerService.sendMail(mail);
  }
}

export default MailRepository;
