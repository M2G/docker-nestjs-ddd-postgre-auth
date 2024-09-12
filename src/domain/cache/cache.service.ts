import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from '../../infrastructure/cache/repository/redis.repository';

@Injectable()
export default class RedisService {
  constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}
}
