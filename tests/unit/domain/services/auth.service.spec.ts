import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { AuthService, YcI18nService } from '@domain/services';
import { RedisRepository, AuthRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import UserModule from 'src/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../../src/infrastructure/models/user';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { mockService, userData } from 'tests/mocks';
import config from '@config';

describe('RedisService', () => {
  let testingModule: TestingModule;
  let authService: AuthService;

  const authRepositoryMock: MockProxy<AuthRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AuthService, mockService(AuthRepository, authRepositoryMock)],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    authService = testingModule.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully validate user', async () => {
    authRepositoryMock.validateUser.mockResolvedValue(userData);
    const result = await authService.validateUser({
      email: userData.email,
      password: userData.password,
    });
    expect(result).toEqual(userData);
    expect(authRepositoryMock.validateUser).toHaveBeenCalledTimes(1);
    expect(authRepositoryMock.validateUser).toHaveBeenCalledWith({
      email: userData.email,
      password: userData.password,
    });
  });

  it('should successfully register user', async () => {
    authRepositoryMock.register.mockResolvedValue({ accessToken: 'token' });
    const modified_at = new Date().toISOString();
    const result = await authService.register({
      email: userData.email,
      password: userData.password,
      created_at: userData.created_at,
      modified_at: modified_at,
    } as any);
    expect(result).toEqual({ accessToken: 'token' });
    expect(authRepositoryMock.register).toHaveBeenCalledTimes(1);
    expect(authRepositoryMock.register).toHaveBeenCalledWith({
      email: userData.email,
      password: userData.password,
      created_at: userData.created_at,
      modified_at: modified_at,
    } as any);
  });

  it('should successfully login user', async () => {
    authRepositoryMock.login.mockResolvedValue({ accessToken: 'token' } as never);
    const updateAt = new Date().toISOString();
    const result = await authService.login({
      email: userData.email,
      password: userData.password,
      created_at: userData.created_at,
      modified_at: updateAt,
    });
    expect(result).toEqual({ accessToken: 'token' } as never);
    expect(authRepositoryMock.login).toHaveBeenCalledTimes(1);
    expect(authRepositoryMock.login).toHaveBeenCalledWith({
      email: userData.email,
      password: userData.password,
      created_at: userData.created_at,
      modified_at: updateAt,
    });
  });
});
