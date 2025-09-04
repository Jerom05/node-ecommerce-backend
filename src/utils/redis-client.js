import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

redisClient.on('end', () => console.warn('Redis connection closed'));

redisClient.on('reconnecting', (delay, attempt) => {
  console.log(
    `🔄 Redis reconnecting... attempt #${attempt}, next try in ${delay}ms`
  );
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error(
      'Initial Redis connection failed, continuing without cache:',
      error
    );
  }
};

export default redisClient;
