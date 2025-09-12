import redisClient from './redis-client.js';
import eventBus from './event-bus.js';

eventBus.on('product:changed', async () => {
  const keys = await redisClient.keys('*products*');
  console.log('Event received: product:changed');
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Cleared ${keys.length} product cache keys (event-driven)`);
  }
});

eventBus.on('user:updated', async () => {
  const keys = await redisClient.keys('*users*');
  console.log('Event received: user:changed');
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Cleared ${keys.length} user cache keys (event-driven)`);
  }
});
