import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RedisRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import { UserEntity as User } from '@domain/entities';

@Injectable()
class RedisService {
  TIME_EXPIRATION = 60;

  constructor(
    @Inject(forwardRef(() => RedisRepository)) private readonly redisRepository: RedisRepository,
  ) {}

  findLastUserConnected(): AsyncIterable<string> | null {
    return this.redisRepository.scanIterator(RedisPrefixEnum.LAST_CONNECTED_AT);
  }

  saveLastUserConnected(userId: number | undefined): void {
    void this.redisRepository.setWithExpiry(
      `${RedisPrefixEnum.LAST_CONNECTED_AT}:${userId}`,
      JSON.stringify({
        id: userId,
        last_connected_at: Math.floor(Date.now() / 1000),
      }),
      this.TIME_EXPIRATION * this.TIME_EXPIRATION,
    );
  }

  findLastUserConnectected(key: string): Promise<string | null> {
    return this.redisRepository.get(key);
  }

  findUser(userId: string): Promise<string | null> {
    return this.redisRepository.get(`${RedisPrefixEnum.USER}:${userId}`);
  }

  saveUser(user: User): void {
    void this.redisRepository.setWithExpiry(
      `${RedisPrefixEnum.USER}:${user.id}`,
      JSON.stringify(user),
      this.TIME_EXPIRATION,
    );
  }

  findUsers(): Promise<string | null> {
    return this.redisRepository.get(RedisPrefixEnum.USERS);
  }

  saveUsers(users: User[]): void {
    void this.redisRepository.setWithExpiry(
      RedisPrefixEnum.USERS,
      JSON.stringify(users),
      this.TIME_EXPIRATION,
    );
  }

  removeUser(userId: number): Promise<string | null> {
    return this.redisRepository.delete(`${RedisPrefixEnum.USER}:${userId}`);
  }
}

export default RedisService;
