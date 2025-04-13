import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Request, ValidationPipe } from '@nestjs/common';
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
import UsersController from '../../src/application/controllers/users';

describe('UsersController', () => {
  let testingModule: TestingModule;
  let usersController: UsersController;
  let userService: UserService;

  const user = {
    dataValues: {
      id: 5,
      username: 'test',
      password: 'password',
      name: 'test',
    },
  };

  const update = {
    email: 'smith.jackson@university2.com',
    first_name: 'test',
    last_name: 'test',
  };

  const mockUsersService = {
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

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUsersService)
      .compile();

    userService = testingModule.get<UserService>(UserService);
    usersController = testingModule.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should return a single movie', async () => {
    const args = {
      attributes: undefined,
      filters: '',
      page: 1,
      pageSize: 10,
    };

    const result = user.dataValues;
    jest.spyOn(userService as any, 'find').mockImplementation(() => result);

    expect(await usersController.findAll({ query: args })).toBe(result);
  });

  it('should return a single movie 2', async () => {
    const result = user.dataValues;
    jest.spyOn(userService as any, 'findOne').mockImplementation(() => result);

    expect(await usersController.findOne({ id: user.dataValues.id } as unknown as string)).toBe(
      result,
    );
  });

  it('should return a single movie 3', async () => {
    const result = user.dataValues;
    jest.spyOn(userService as any, 'register').mockImplementation(() => result);

    expect(await usersController.create(user.dataValues.id)).toBe(result);
  });

  it('should return a single movie 4', async () => {
    const result = { email: 'test' };
    jest.spyOn(userService as any, 'forgotPassword').mockImplementation(() => result);

    expect(await usersController.forgotPassword({ email: 'test' })).toBe(result);
  });

  it('should return a single movie 6', async () => {
    const password = { password: 'test' };
    const rqt = { query: { token: 'teqt' } };

    const result = {
      password: 'test',
      reset_password_token: 'test',
    };
    jest.spyOn(userService, 'resetPassword').mockImplementation(() => result);

    expect(await usersController.resetPassword(password, rqt)).toBe(result);
  });
});
