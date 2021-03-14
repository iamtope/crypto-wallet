import 'dotenv/config';

export default {
  DATABASE_URL: process.env.CRYPTO_POSTGRES_TEST_URL,
  REDIS_URL: process.env.REDIS_URL,
  PORT: process.env.CRYPTO_PORT
};
