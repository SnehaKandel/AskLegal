const { createClient } = require('redis');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.client.on('error', (err) => logger.error('Redis error:', err));
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      logger.info('Redis client connected');
    } catch (err) {
      logger.error('Redis connection failed:', err);
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      logger.error('Cache get error:', err);
      return null;
    }
  }

  async set(key, value, expire = 3600) {
    try {
      await this.client.set(key, value, { EX: expire });
    } catch (err) {
      logger.error('Cache set error:', err);
    }
  }

  async clear(pattern = 'news-*') {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (err) {
      logger.error('Cache clear error:', err);
    }
  }
}

module.exports = new CacheService();