const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('Too many retries, exiting...');
        return new Error('Connection failed');
      }
      return Math.min(retries * 100, 5000); // Reconnect delay
    }
  }
});

// Handle connection events
client.on('connect', () => console.log('Redis client connected'));
client.on('error', (err) => console.error('Redis error:', err));
client.on('end', () => console.log('Redis connection closed'));
client.on('reconnecting', () => console.log('Redis reconnecting'));

// Promisify methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Graceful shutdown
process.on('SIGINT', () => client.quit());

module.exports = { client, getAsync, setAsync };