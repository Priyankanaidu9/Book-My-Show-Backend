import { createClient } from 'redis';

let redisClient = null;

if (process.env.REDIS_ENABLED === 'true') {
  const { createClient } = await import('redis');

  redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on('error', err =>
    console.error('Redis error:', err)
  );

  await redisClient.connect();
}

export default redisClient;


