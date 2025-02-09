import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailRepository } from '@infrastructure/repository';

@Injectable()
class MailService {
  constructor(
    @Inject(forwardRef(() => MailRepository)) private readonly mailRepository: MailRepository,
  ) {}

  send(mail) {
    return this.mailRepository.sendMail(mail);
  }
}

export default MailService;
