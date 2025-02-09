import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { createClient } from 'redis';
import AppModule from 'src/app.module';
// import { RedisRepositoryInterface } from '../../../../src/domain/interface/redis.repository.interface';
import RedisRepository from 'src/infrastructure/repository/cache';
import { mockRedis } from '../../../mocks/redis-mock';
import { REDIS_CLIENT } from '../../../../src/config/redis-client.type';
import { RedisService } from '@domain/services';
import redisClientFactory from '../../../../src/config';
import RedisModule from '../../../../src/redis.module';

describe('RedisRepository', () => {
  let testingModule: TestingModule;
  let redisRepository: any;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [RedisModule],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue(mockRedis)
      .compile();

    redisRepository = testingModule.get<RedisRepository>(RedisRepository);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await testingModule.close();
  });

  it('should correctly get key', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';
    mockRedis.get.mockResolvedValue(value);

    const result = await redisRepository.get(key);

    console.log('result', result);

    expect(result).toEqual(value);
    expect(mockRedis.get).toHaveBeenCalledTimes(1);
    expect(mockRedis.get).toHaveBeenCalledWith(key);
  });

  it('should correctly set key', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';

    await redisRepository.set(key, value);
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
    expect(mockRedis.set).toHaveBeenCalledWith(key, value);
  });

  it('should correctly delete key', async () => {
    const prefix = 'prefix';
    const key = 'key';

    await redisRepository.delete(key);
    expect(mockRedis.del).toHaveBeenCalledTimes(1);
    expect(mockRedis.del).toHaveBeenCalledWith(key);
  });

  it('should correctly set key with expiry', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';

    await redisRepository.setWithExpiry(key, value, 100);
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
    expect(mockRedis.set).toHaveBeenCalledWith(key, value, { EX: 100 });
  });
});
