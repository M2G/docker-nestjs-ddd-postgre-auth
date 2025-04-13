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
import { AuthControllers } from '../../src/application/controllers';
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
  let app: INestApplication;
  let authToken;

  const mockPostsModel = {};
  const authRepositoryMock: MockProxy<AuthRepository> = mock();
  const YcI18nServiceMock: MockProxy<YcI18nService> = mock();
  const userRepositoryMock: MockProxy<UserRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [TokenModule],
      // controllers: [AuthControllers],
      providers: [
        //  AuthService,
        //  YcI18nService,
        mockService(YcI18nService, YcI18nServiceMock),
        //  mockService(AuthRepository, authRepositoryMock),
        mockService(TokenRepository, mock()),

        mockService(UserRepository, userRepositoryMock),
      ],
    })
      .overrideProvider(getModelToken(User))
      .useValue(mockPostsModel)
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
      //.overrideProvider(REDIS_CLIENT)
      //.useValue(mockRedis)
      .compile();

    app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('/auth/refresh_token (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh_token')
      .send({
        requestToken: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
