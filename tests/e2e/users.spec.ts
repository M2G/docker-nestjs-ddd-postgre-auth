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
} from '../../src/domain/services';
import { I18nService } from 'nestjs-i18n';
import { mock, MockProxy } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import User from '@infrastructure/models/user/user.model';
import { AuthControllers, UserControllers } from '../../src/application/controllers';
import {
  AuthRepository,
  MailRepository,
  RedisRepository,
} from '../../src/infrastructure/repository';
import { REDIS_CLIENT, redisClientFactory } from '../../src/config';
import { mockRedis } from '../mocks/redis-mock';
import UserRepository from '../../src/infrastructure/repository/user/user.repository';
import { JwtAuthGuard } from '@application/auth/guards';

const user = {
  dataValues: {
    id: 5,
    username: 'test',
    password: 'password',
    name: 'test',
  },
  validatePassword: jest.fn().mockImplementation((password) => true),
};

const update = {
  email: 'smith.jackson@university2.com',
  first_name: 'test',
  last_name: 'test',
};

const mockUsersService = {
  findByUsername: jest.fn().mockImplementation((_) => user),
  findOne: jest.fn().mockImplementation((dto) => user),
  find: jest.fn().mockImplementation((dto) => [user]),
  findAll: jest.fn().mockImplementation((dto) => [user]),
  login: jest.fn().mockImplementation((dto) => user),
};

const mockUsersService22 = {
  register: jest.fn().mockImplementation((_) => user.dataValues),
  findOne: jest.fn().mockImplementation((dto) => user.dataValues),
  find: jest.fn().mockImplementation((dto) => [user.dataValues]),
  findAll: jest.fn().mockImplementation((dto) => [user.dataValues]),
  login: jest.fn().mockImplementation((dto) => user),
  update: jest.fn().mockImplementation((dto) => ({ ...user.dataValues, ...update })),
  remove: jest.fn().mockImplementation((password) => true),
  forgotPassword: jest.fn().mockImplementation((password) => true),
  resetPassword: jest.fn().mockImplementation((password) => true),
};

const mockUsersService2 = {
  login: jest.fn().mockImplementation(() => ({
    accessToken: 'test',
  })),
};

const mock_ForceFailGuard = { canActivate: jest.fn(() => true) };

describe('AppController (e2e)', () => {
  let testingModule: TestingModule;
  let app: INestApplication;
  let authToken;

  const mockUsersModel = {};

  const mailRepositoryMock: MockProxy<UserRepository> = mock();
  const mailServiceMock: MockProxy<MailService> = mock();
  const YcI18nServiceMock: MockProxy<YcI18nService> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      // controllers: [UserControllers, AuthControllers],
      imports: [UsersModule, AuthModule],
      /* providers: [
        UserService,
        AuthService,
        mockService(UserRepository, authRepositoryMock),
        mockService(AuthRepository, test2),
        mockService(YcI18nService, YcI18nServiceMock),
      ],*/
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mock_ForceFailGuard)
      .overrideProvider(MailRepository)
      .useValue(mailRepositoryMock)
      .overrideProvider(getModelToken(User))
      .useValue(mockUsersModel)
      .overrideProvider(UserRepository)
      .useValue(mockUsersService22)
      .overrideProvider(YcI18nService)
      .useValue(YcI18nServiceMock)
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .overrideProvider(AuthService)
      .useValue(mockUsersService2)
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const loginResponse = await request(app.getHttpServer()).post('/auth/authenticate').send({
      email: 'smith.jackson@university.com',
      password: 'test',
    });

    authToken = `Bearer ${loginResponse.body.accessToken}`;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', authToken)
      .expect(200)
      .expect([user.dataValues]);
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/5')
      .set('Authorization', authToken)
      .expect(200)
      .expect(user.dataValues);
  });

  it('/users/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/5')
      .set('Authorization', authToken)
      .send({
        email: 'smith.jackson@university2.com',
        first_name: 'test',
        last_name: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ ...user.dataValues, ...update });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/5')
      .set('Authorization', authToken)
      .expect(204);
  });

  it('/users/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .set('Authorization', authToken)
      .send({
        email: 'smith.jackson@university.com',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect(user.dataValues);
  });

  it('/users/forgot-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/forgot-password')
      .set('Authorization', authToken)
      .send({
        email: 'smith.jackson@university.com',
      })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201);
  });

  it('/auth/reset-password (POST)', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNtaXRoLmphY2tzb25AdW5pdmVyc2l0eS5jb20iLCJpZCI6NSwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNzM3Nzc5NTI2LCJleHAiOjE3Mzc3Nzk1NTYsImF1ZCI6W10sInN1YiI6InNtaXRoLmphY2tzb25AdW5pdmVyc2l0eS5jb20ifQ.khUk-x6t5jPIYTLZtLVtudrEhX_gRyMnzfW0e0OnyiA';

    return request(app.getHttpServer())
      .post(`/users/reset-password?token=${token}`)
      .set('Authorization', authToken)
      .send({
        new_password: 'test2',
        verify_password: 'test2',
      })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201);
  });
});
