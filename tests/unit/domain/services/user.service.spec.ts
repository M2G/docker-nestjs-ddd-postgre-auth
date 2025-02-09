import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { UserService } from '@domain/services';
import { RedisRepository, UsersRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import userData from 'tests/mocks/userData.mock';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import UserModule from 'src/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from '../../../../src/infrastructure/models/user';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { mockService } from 'tests/mocks';

const oneDayInSeconds = 60;

describe('RedisService', () => {
  let testingModule: TestingModule;
  let userService: UserService;

  const userRepositoryMock: MockProxy<UsersRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        /*SequelizeModule.forRoot({
          autoLoadModels: true,
          database: 'test_db',
          dialect: 'postgres',
          host: 'postgres',
          password: 'postgres',
          port: 5432,
          synchronize: true,
          username: 'postgres',
        }),
        UserModule,
        */
      ],
      providers: [UsersService, mockService(UsersRepository, userRepositoryMock)],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    userService = testingModule.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully find user', async () => {
    userRepositoryMock.findOne.mockResolvedValue(userData);
    const userId = 1;
    const result = await userService.findOne({ id: userId });
    expect(result).toEqual(userData);
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ id: userId } as any);
  });

  it('should successfully create user', async () => {
    userRepositoryMock.register.mockResolvedValue(userData as never);
    const result = await userService.register(userData);
    expect(result).toEqual(userData);
    expect(userRepositoryMock.register).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.register).toHaveBeenCalledWith(userData);
  });

  it('should successfully remove user', async () => {
    const userId = 1;
    userRepositoryMock.remove.mockResolvedValue(1 as any);
    const result = await userService.remove({ id: userId } as any);
    expect(result).toEqual(1);
    expect(userRepositoryMock.remove).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.remove).toHaveBeenCalledWith({ id: userId } as any);
  });

  it('should successfully update user', async () => {
    userRepositoryMock.update.mockResolvedValue(userData);
    const result = await userService.update(userData);
    expect(result).toEqual(userData);
    expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(userData);
  });

  it('should successfully authenticate user', async () => {
    userRepositoryMock.authenticate.mockResolvedValue(userData as any);
    const result = await userService.authenticate({ email: userData.email });
    expect(result).toEqual(userData);
    expect(userRepositoryMock.authenticate).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.authenticate).toHaveBeenCalledWith({ email: userData.email } as any);
  });

  it('should successfully changePassword user', async () => {
    userRepositoryMock.changePassword.mockResolvedValue(userData);
    const result = await userService.changePassword({
      id: userData.id,
      old_password: userData.password,
      password: userData.password,
    });
    expect(result).toEqual(userData);
    expect(userRepositoryMock.changePassword).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.changePassword).toHaveBeenCalledWith({
      id: userData.id,
      old_password: userData.password,
      password: userData.password,
    } as any);
  });

  it('should successfully forgotPassword user', async () => {
    userRepositoryMock.forgotPassword.mockResolvedValue(userData);
    const result = await userService.forgotPassword({ email: userData.email });
    expect(result).toEqual(userData);
    expect(userRepositoryMock.forgotPassword).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.forgotPassword).toHaveBeenCalledWith({
      email: userData.email,
    } as any);
  });

  it('should successfully resetPassword user', async () => {
    userRepositoryMock.resetPassword.mockResolvedValue(userData);
    const result = await userService.resetPassword({
      password: userData.password,
      reset_password_token: 'test',
    });
    expect(result).toEqual(userData);
    expect(userRepositoryMock.resetPassword).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.resetPassword).toHaveBeenCalledWith({
      password: userData.password,
      reset_password_token: 'test',
    } as any);
  });
});
