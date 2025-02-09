import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RedisRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import { UserEntity as User } from '@domain/entities';

@Injectable()
class RedisService {
  constructor(
    @Inject(forwardRef(() => RedisRepository)) private readonly redisRepository: RedisRepository,
  ) {}

  findLastUserConnected(): Promise<any> {
    return this.redisRepository.scanIterator(RedisPrefixEnum.LAST_CONNECTED_AT);
  }

  saveLastUserConnected(userId: number | undefined): Promise<any> {
    return this.redisRepository.setWithExpiry(
      `${RedisPrefixEnum.LAST_CONNECTED_AT}:${userId}`,
      JSON.stringify({
        id: userId,
        last_connected_at: Math.floor(Date.now() / 1000),
      }),
      60 * 60,
    );
  }

  findLastUserConnectected(key: string): Promise<any | null> {
    return this.redisRepository.get(key);
  }

  findUser(userId: string): Promise<string | null> {
    return this.redisRepository.get(`${RedisPrefixEnum.USER}:${userId}`);
  }

  saveUser(user: User | null): Promise<string | null> {
    return this.redisRepository.setWithExpiry(
      `${RedisPrefixEnum.USER}:${user?.id}`,
      JSON.stringify(user),
      60,
    );
  }

  findUsers(): Promise<string | null> {
    return this.redisRepository.get(RedisPrefixEnum.USERS);
  }

  saveUsers(users: User[]): Promise<string | null> {
    return this.redisRepository.setWithExpiry(RedisPrefixEnum.USERS, JSON.stringify(users), 60);
  }

  removeUser(userId: number): Promise<string | null> {
    return this.redisRepository.delete(`${RedisPrefixEnum.USER}:${userId}`);
  }
}

export default RedisService;
