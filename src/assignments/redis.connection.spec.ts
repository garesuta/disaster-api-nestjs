import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';

describe('Redis Connection', () => {
  let redisStore: Keyv;

  beforeAll(() => {
    redisStore = new Keyv({
      store: new KeyvRedis('redis://localhost:6379'),
    });
  });

  afterAll(async () => {
    await redisStore.clear();
    await redisStore.disconnect();
  });

  it('should set and get a value from Redis', async () => {
    await redisStore.set('test-key', 'test-value');
    const value = await redisStore.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should delete a value from Redis', async () => {
    await redisStore.set('delete-key', 'to-be-deleted');
    await redisStore.delete('delete-key');
    const value = await redisStore.get('delete-key');
    expect(value).toBeUndefined();
  });
});