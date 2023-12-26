import Redis from 'ioredis';

import { REDIS } from '~/lib/config';

export const redis = new Redis(REDIS.url);
