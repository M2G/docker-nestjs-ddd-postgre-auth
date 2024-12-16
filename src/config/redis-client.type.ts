import type { createClient } from 'redis';

/**
 * Since node-redis does not expose types for its client, we have to create our own.
 */
export type RedisClient = ReturnType<typeof createClient>;

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
