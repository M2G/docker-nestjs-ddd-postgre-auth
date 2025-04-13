import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { AuthService, YcI18nService } from '@domain/services';
import { RedisRepository, UsersRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import userData from 'tests/mocks/userData.mock';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { mockService } from 'tests/mocks';
import { AuthControllers } from '@application/controllers';

const service = {
  I18nOptions: jest.fn(),
  I18nTranslations: jest.fn(),
  I18nLanguages: jest.fn(),
  Logger: jest.fn(),
  I18nLoader: jest.fn(),
  I18nLanguagesSubject: jest.fn(),
  I18nTranslationsSubject: jest.fn(),
};

describe('RedisService', () => {
  let testingModule: TestingModule;
  let authControllers: AuthControllers;
  const authServiceMock: MockProxy<AuthService> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AuthControllers],
      imports: [],
      providers: [mockService(AuthService, authServiceMock as any), I18nService, YcI18nService],
    })
      .overrideProvider(I18nService)
      .useValue(service)
      .overrideProvider(YcI18nService)
      .useValue(service)
      .compile();

    authControllers = testingModule.get<AuthControllers>(AuthControllers) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully register user', async () => {
    authServiceMock.register.mockResolvedValue({ accessToken: 'test' });
    const data = (await authControllers.create({
      email: userData.email,
      password: userData.password,
    })) as any;

    expect(authServiceMock.register).toHaveBeenCalledTimes(1);
    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: userData.email,
      password: userData.password,
    });
    expect(data).toBeTruthy();
  });

  it('should successfully login user', async () => {
    authServiceMock.login.mockResolvedValue(userData as never);
    const data = await authControllers.login({
      email: userData.email,
      password: userData.password,
    } as any);

    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(data).toBeTruthy();
  });
});
