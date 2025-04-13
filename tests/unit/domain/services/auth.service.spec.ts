import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { AuthService } from '@domain/services';
import { AuthRepository } from '@infrastructure/repository';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';
import { mockService, userData } from 'tests/mocks';

describe('AuthService', () => {
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

    authService = testingModule.get<AuthService>(AuthService) as any;
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
    const modifiedAt = new Date().toISOString();
    const result = await authService.register({
      created_at: userData.created_at,
      email: userData.email,
      modified_at: modifiedAt,
      password: userData.password,
    } as any);
    expect(result).toEqual({ accessToken: 'token' });
    expect(authRepositoryMock.register).toHaveBeenCalledTimes(1);
    expect(authRepositoryMock.register).toHaveBeenCalledWith({
      created_at: userData.created_at,
      email: userData.email,
      modified_at: modifiedAt,
      password: userData.password,
    } as any);
  });

  it('should successfully login user', async () => {
    authRepositoryMock.login.mockResolvedValue({ accessToken: 'token' } as never);
    const updateAt = new Date().toISOString();
    const result = await authService.login({
      created_at: userData.created_at,
      email: userData.email,
      modified_at: updateAt,
      password: userData.password,
    });
    expect(result).toEqual({ accessToken: 'token' } as never);
    expect(authRepositoryMock.login).toHaveBeenCalledTimes(1);
    expect(authRepositoryMock.login).toHaveBeenCalledWith({
      created_at: userData.created_at,
      email: userData.email,
      modified_at: updateAt,
      password: userData.password,
    });
  });
});
