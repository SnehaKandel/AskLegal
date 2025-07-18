const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', newsController.newsApiLimiter, newsController.getNews);
router.get('/latest', newsController.getLatestNews);
router.get('/sources', newsController.getNewsSources);
router.get('/status', newsController.getSchedulerStatus);

// Admin routes
router.post('/refresh', protect, authorize('admin'), newsController.refreshNews);
router.post('/start-scheduler', protect, authorize('admin'), newsController.startScheduler);
router.post('/stop-scheduler', protect, authorize('admin'), newsController.stopScheduler);
router.post('/trigger-scraping', protect, authorize('admin'), newsController.triggerScraping);

// Testing route (remove in production)
router.get('/test-scrape', newsController.testScrape);

module.exports = router;