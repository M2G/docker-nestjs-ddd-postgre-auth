import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { UserService, YcI18nService } from '@domain/services';
import { RedisRepository, UsersRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import userData from 'tests/mocks/userData.mock';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { mockService } from 'tests/mocks';
import { UserControllers } from '@application/controllers';

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
  let userController: UserControllers;
  const userServiceMock: MockProxy<UserService> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [UserControllers],
      imports: [],
      providers: [mockService(UserService, userServiceMock as any), I18nService, YcI18nService],
    })
      .overrideProvider(I18nService)
      .useValue(service)
      .overrideProvider(YcI18nService)
      .useValue(service)
      .compile();

    userController = testingModule.get<UserControllers>(UserControllers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully find users', async () => {
    userServiceMock.find.mockResolvedValue(userData as never);
    const data = (await userController.findAll({
      query: {
        attributes: [],
        filters: '',
        page: 1,
        pageSize: 10,
      },
    })) as any;

    expect(userServiceMock.find).toHaveBeenCalledTimes(1);
    expect(userServiceMock.find).toHaveBeenCalledWith({
      attributes: [],
      filters: '',
      page: 1,
      pageSize: 10,
    });
    expect(data).toEqual(userData);
  });

  it('should successfully find one user', async () => {
    userServiceMock.findOne.mockResolvedValue(userData as never);
    const data = (await userController.findOne(userData.id)) as any;

    expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(userServiceMock.findOne).toHaveBeenCalledWith({ id: userData.id });
    expect(data).toEqual(userData);
  });

  it('should successfully update user', async () => {
    userServiceMock.update.mockResolvedValue(userData as never);
    const data = (await userController.update(userData.id, userData)) as any;

    expect(userServiceMock.update).toHaveBeenCalledTimes(1);
    expect(userServiceMock.update).toHaveBeenCalledWith({ id: userData.id, ...userData });
    expect(data).toEqual(userData);
  });

  it('should successfully remove user', async () => {
    userServiceMock.remove.mockResolvedValue(1 as never);
    const data = (await userController.remove(userData.id)) as any;

    expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
    expect(userServiceMock.remove).toHaveBeenCalledWith({ id: userData.id });
    expect(data).toBeTruthy();
  });

  it('should successfully register user', async () => {
    userServiceMock.register.mockResolvedValue(1 as never);
    const data = (await userController.create(userData.id)) as any;

    expect(userServiceMock.register).toHaveBeenCalledTimes(1);
    expect(userServiceMock.register).toHaveBeenCalledWith({ id: userData.id });
    expect(data).toBeTruthy();
  });

  it('should successfully remove user', async () => {
    userServiceMock.forgotPassword.mockResolvedValue(1 as never);
    const data = (await userController.remove(userData.id)) as any;

    expect(userServiceMock.forgotPassword).toHaveBeenCalledTimes(1);
    expect(userServiceMock.forgotPassword).toHaveBeenCalledWith({ id: userData.id });
    expect(data).toBeTruthy();
  });

  it('should successfully remove user', async () => {
    userServiceMock.resetPassword.mockResolvedValue(1 as never);
    const data = (await userController.resetPassword(userData.id)) as any;

    expect(userServiceMock.resetPassword).toHaveBeenCalledTimes(1);
    expect(userServiceMock.resetPassword).toHaveBeenCalledWith({ id: userData.id });
    expect(data).toBeTruthy();
  });
});
