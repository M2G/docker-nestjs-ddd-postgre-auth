import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import UsersModule from '../../src/user.module';
import AuthModule from '../../src/auth.module';
import { mockService } from 'tests/mocks';
import {
  MailService,
  RedisService,
  UserService,
  YcI18nService,
  AuthService,
  TokenService,
} from '../../src/domain/services';
import { I18nService } from 'nestjs-i18n';
import { mock, MockProxy } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import User from '@infrastructure/models/user/user.model';
import { AuthControllers, TokenControllers } from '../../src/application/controllers';
import {
  AuthRepository,
  RedisRepository,
  TokenRepository,
} from '../../src/infrastructure/repository';
import UserRepository from '../../src/infrastructure/repository/user/user.repository';
import { getModelToken } from '@nestjs/sequelize';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import TokenModule from '../../src/token.module';

const mockTokenService = {
  refreshToken: jest.fn().mockImplementation(() => ({
    accessToken: 'test',
    refreshToken: 'test',
  })),
};

describe('AppController (e2e)', () => {
  let testingModule: TestingModule;
  let tokenController: TokenControllers;
  let tokenService: TokenService;

  const mockPostsModel = {};
  const authRepositoryMock: MockProxy<AuthRepository> = mock();
  const YcI18nServiceMock: MockProxy<YcI18nService> = mock();
  const userRepositoryMock: MockProxy<UserRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [TokenControllers],
      providers: [
        TokenService,
        //  AuthService,
        //  YcI18nService,
        mockService(YcI18nService, YcI18nServiceMock),
        //  mockService(AuthRepository, authRepositoryMock),
        mockService(TokenRepository, mock()),

        mockService(UserRepository, userRepositoryMock),
      ],
    } as any)
      .overrideProvider(getModelToken(User))
      .useValue(mockPostsModel)
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
      .compile();

    tokenService = testingModule.get<TokenService>(TokenService);
    tokenController = testingModule.get<TokenControllers>(TokenControllers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should return a single movie', async () => {
    const result = { requestToken: 'test' };
    jest.spyOn(tokenService as any, 'refreshToken').mockImplementation(() => result);

    expect(await tokenController.refreshToken('test')).toBe(result);
  });
});
