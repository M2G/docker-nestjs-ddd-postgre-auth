import { Inject, Injectable, forwardRef, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigType } from '@nestjs/config';
import redisConfig from 'src/config';
import { RedisRepository } from '@infrastructure/repository';
import RedisPrefixEnum from '@domain/enum';
import { UserEntity as User } from '@domain/entities';

@Injectable()
class RedisService {
  constructor(
    @Inject(forwardRef(() => RedisRepository)) private readonly redisRepository: RedisRepository,
  ) {}

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

  async saveResetToken(userId: string, token: string): Promise<void> {}

  async getResetToken(token: string): Promise<any> {}
}

export default RedisService;
