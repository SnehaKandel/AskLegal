const { scrapeLatestNews } = require('./newsScraper');
const News = require('../models/News');
const logger = require('../utils/logger');

class NewsScheduler {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.lastRun = null;
    this.updateInterval = 7 * 60 * 1000; // 7 minutes (between 5-10 minutes)
  }

  // Start the scheduler
  start() {
    if (this.isRunning) {
      logger.info('News scheduler is already running');
      return;
    }

    logger.info('Starting news scheduler...');
    this.isRunning = true;

    // Run immediately on start
    this.scrapeAndSaveNews();

    // Set up interval for periodic scraping
    this.interval = setInterval(() => {
      this.scrapeAndSaveNews();
    }, this.updateInterval);

    logger.info(`News scheduler started. Will run every ${this.updateInterval / 60000} minutes`);
  }

  // Stop the scheduler
  stop() {
    if (!this.isRunning) {
      logger.info('News scheduler is not running');
      return;
    }

    logger.info('Stopping news scheduler...');
    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    logger.info('News scheduler stopped');
  }

  // Scrape news and save to database
  async scrapeAndSaveNews() {
    try {
      logger.info('Starting news scraping...');
      this.lastRun = new Date();

      const articles = await scrapeLatestNews();
      logger.info(`Scraped ${articles.length} articles`);

      let newArticlesCount = 0;
      let updatedArticlesCount = 0;

      for (const article of articles) {
        try {
          // Normalize the article data
          const articleData = {
            title: article.title,
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt || new Date(),
            summary: article.summary,
            content: article.content,
            imageUrl: article.imageUrl,
            language: article.language || 'en'
          };

          // Skip if missing required fields
          if (!articleData.title || !articleData.url || !articleData.source) {
            continue;
          }

          // Check for existing article by URL
          const existingArticle = await News.findOne({ url: articleData.url });
          
          if (existingArticle) {
            // Update existing article if needed
            const needsUpdate = 
              existingArticle.title !== articleData.title ||
              existingArticle.summary !== articleData.summary ||
              existingArticle.imageUrl !== articleData.imageUrl;

            if (needsUpdate) {
              await News.findByIdAndUpdate(existingArticle._id, articleData);
              updatedArticlesCount++;
            }
          } else {
            // Save new article
            await News.create(articleData);
            newArticlesCount++;
          }

        } catch (err) {
          logger.error(`Error processing article ${article.title}: ${err.message}`);
        }
      }

      logger.info(`News scraping completed. New: ${newArticlesCount}, Updated: ${updatedArticlesCount}`);

    } catch (error) {
      logger.error('Error in news scraping:', error.message);
    }
  }

  // Manual trigger for immediate scraping
  async triggerScrape() {
    logger.info('Manual news scraping triggered');
    await this.scrapeAndSaveNews();
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      updateInterval: this.updateInterval,
      nextRun: this.lastRun ? new Date(this.lastRun.getTime() + this.updateInterval) : null
    };
  }

  // Set update interval (in minutes)
  setUpdateInterval(minutes) {
    this.updateInterval = minutes * 60 * 1000;
    logger.info(`Update interval changed to ${minutes} minutes`);
    
    // Restart scheduler with new interval
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Create singleton instance
const newsScheduler = new NewsScheduler();

module.exports = newsScheduler; 