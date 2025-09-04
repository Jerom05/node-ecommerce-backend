import redisClient from '../utils/redis-client.js';

export const cache =
  (ttl = 60) =>
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
