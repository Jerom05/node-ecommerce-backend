import redisClient from '../utils/redis-client.js';
import eventBus from '../utils/event-bus.js';

export const cache =
  (ttl = 300) =>
  async (req, res, next) => {
    if (!process.env.REDIS_URL) {
      console.log('Redis URL not set, skipping cache middleware');
      return next();
    }
    const key = req.originalUrl;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log('Serving from Redis Cache');
      return res.json(JSON.parse(cachedData));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, ttl, JSON.stringify(body));
      console.log('Data saved to Redis Cache');
      originalJson(body);
    };

    next();
  };

export const cacheClearEvent = (event) => async (req, res, next) => {
  if (!process.env.REDIS_URL) {
    console.log('Redis URL not set, skipping cache clear middleware');
    return next();
  }

  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (!body.error) {
      console.log('Clearing Redis Cache', event);
      eventBus.emit(event);
    }
    originalJson(body);
  };
  next();
};
