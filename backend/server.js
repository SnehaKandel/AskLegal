const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
require('dotenv').config();

// Connect to database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Optional: Redis health check if using Redis
const cache = require('./services/cache');
cache.client.on('ready', () => {
  console.log('✅ Redis ready for connections');
});
