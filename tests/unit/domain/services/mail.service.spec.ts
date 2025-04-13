import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { MailService } from '@domain/services';
import type { MailRepository } from '@infrastructure/repository';
import { mockService } from '../../../mocks';

describe('YcI18nService', () => {
  let testingModule: TestingModule;
  let mailService: MailService;

  const mailServiceMock: MockProxy<MailRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [mockService(MailService, mailServiceMock)],
    }).compile();

    mailService = testingModule.get<MailRepository>(MailService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should successfully find user', async () => {
    const mail = {
      from: 'Kingsley Okure',
      subject: `Password help has arrived!`,
      text: `http://localhost:3002/reset-password?token=test`,
      to: 'joanna@gmail.com',
    };

    mailServiceMock.sendMail.mockResolvedValue(mail);
    const result = await mailService.send(mail);
    expect(result).toEqual(mail);
    expect(mailServiceMock.sendMail).toHaveBeenCalledTimes(1);
    expect(mailServiceMock.sendMail).toHaveBeenCalledWith(mail);
  });
});
