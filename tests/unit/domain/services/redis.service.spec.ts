import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { RedisService } from '@domain/services';
import { RedisRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import userData from 'tests/mocks/userData.mock';
import { mockRedis } from 'tests/mocks/redis-mock';
import { REDIS_CLIENT } from 'src/config/redis-client.type';

const oneDayInSeconds = 60;

describe('RedisService', () => {
  let testingModule: TestingModule;
  let redisService: RedisService;

  const redisRepositoryMock: MockProxy<RedisRepository> = mock();

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: RedisRepository,
          useValue: redisRepositoryMock,
        },
      ],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    redisService = testingModule.get<RedisService>(RedisService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should successfully save user', async () => {
    const userId = userData.id;
    await redisService.saveUser(userData);
    expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledTimes(1);
    expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
      `${RedisPrefixEnum.USER}:${userId}`,
      JSON.stringify(userData),
      oneDayInSeconds,
    );
  });

  it('should successfully save users', async () => {
    await redisService.saveUsers(userData);
    expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledTimes(1);
    expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
      RedisPrefixEnum.USERS,
      JSON.stringify(userData),
      oneDayInSeconds,
    );
  });

  it('should successfully get users', async () => {
    redisRepositoryMock.get.mockResolvedValue(JSON.stringify(userData));
    const result = await redisService.findUsers();
    expect(result).toEqual(JSON.stringify(userData));
    expect(redisRepositoryMock.get).toHaveBeenCalledTimes(1);
    expect(redisRepositoryMock.get).toHaveBeenCalledWith(RedisPrefixEnum.USERS);
  });

  it('should successfully remove user', async () => {
    const userId = userData.id;
    redisRepositoryMock.delete.mockResolvedValue(1);
    const result = await redisService.removeUser(userId);
    expect(result).toEqual(1);
    expect(redisRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(redisRepositoryMock.delete).toHaveBeenCalledWith(`${RedisPrefixEnum.USER}:${userId}`);
  });
});
