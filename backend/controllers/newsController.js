const mongoose = require('mongoose');
const News = require('../models/News');
const cache = require('../services/cache');
const { scrapeLatestNews } = require('../services/newsScraper');
const newsScheduler = require('../services/newsScheduler');
const rateLimit = require('express-rate-limit');

// Configure rate limiter for news API
exports.newsApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  }
});

// Helper function to normalize URLs
const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname}`.replace(/\/$/, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

// Enhanced refreshNews function
exports.refreshNews = async (req, res) => {
  try {
    // Force Mongoose to use permissive mode
    mongoose.set('strict', false);
    mongoose.set('strictQuery', false);

    const newArticles = await scrapeLatestNews();
    const addedArticles = [];
    
    for (const article of newArticles) {
      try {
        // Normalize the article data
        const articleToSave = {
          title: article.title,
          source: article.source,
          url: article.url,
          publishedAt: article.publishedAt || new Date(),
          summary: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          language: article.language || 'en' // Use the language from the scraper or default to English
        };

        // Skip if missing required fields
        if (!articleToSave.title || !articleToSave.url || !articleToSave.source) {
          continue;
        }

        // Check for existing article
        const exists = await News.findOne({ url: articleToSave.url });
        if (exists) continue;

        // Save using raw MongoDB driver if needed
        const saved = await News.create(articleToSave);
        addedArticles.push(saved);
        
      } catch (err) {
        console.error(`Error saving article: ${err.message}`);
      }
    }

    await cache.clear('news-*');
    res.json({
      success: true,
      added: addedArticles.length,
      articles: addedArticles
    });

  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get news with improved caching and pagination
exports.getNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, language, source } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (language) query.language = language;
    if (source) query.source = source;

    // Cache key
    const cacheKey = `news-${JSON.stringify(query)}-${page}-${limit}`;
    
    // Try cache first
    const cachedNews = await cache.get(cacheKey);
    if (cachedNews) {
      return res.json({
        success: true,
        fromCache: true,
        ...JSON.parse(cachedNews)
      });
    }

    // Database query
    const [news, total] = await Promise.all([
      News.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      News.countDocuments(query)
    ]);

    // Cache results for 5 minutes
    const responseData = {
      success: true,
      fromCache: false,
      count: news.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      news,
      scheduler: newsScheduler.getStatus()
    };

    // Cache data for 5 minutes
    await cache.set(cacheKey, JSON.stringify(responseData), 300);

    res.json(responseData);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get latest news (for homepage)
exports.getLatestNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const cacheKey = `latest-news-${limit}`;
    const cachedNews = await cache.get(cacheKey);
    
    if (cachedNews) {
      return res.json({
        success: true,
        fromCache: true,
        ...JSON.parse(cachedNews)
      });
    }

    const news = await News.find({})
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .select('title source url publishedAt summary imageUrl');

    const responseData = {
      success: true,
      fromCache: false,
      count: news.length,
      news
    };

    // Cache for 2 minutes
    await cache.set(cacheKey, JSON.stringify(responseData), 120);

    res.json(responseData);
  } catch (err) {
    console.error('Error fetching latest news:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get news sources
exports.getNewsSources = async (req, res) => {
  try {
    const sources = await News.distinct('source');
    res.json({
      success: true,
      sources
    });
  } catch (err) {
    console.error('Error fetching news sources:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get scheduler status
exports.getSchedulerStatus = async (req, res) => {
  try {
    const status = newsScheduler.getStatus();
    res.json({
      success: true,
      status
    });
  } catch (err) {
    console.error('Error getting scheduler status:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Start scheduler (admin only)
exports.startScheduler = async (req, res) => {
  try {
    newsScheduler.start();
    res.json({
      success: true,
      message: 'News scheduler started successfully',
      status: newsScheduler.getStatus()
    });
  } catch (err) {
    console.error('Error starting scheduler:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Stop scheduler (admin only)
exports.stopScheduler = async (req, res) => {
  try {
    newsScheduler.stop();
    res.json({
      success: true,
      message: 'News scheduler stopped successfully',
      status: newsScheduler.getStatus()
    });
  } catch (err) {
    console.error('Error stopping scheduler:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Manual trigger scraping (admin only)
exports.triggerScraping = async (req, res) => {
  try {
    await newsScheduler.triggerScrape();
    res.json({
      success: true,
      message: 'Manual news scraping triggered successfully',
      status: newsScheduler.getStatus()
    });
  } catch (err) {
    console.error('Error triggering scraping:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Test scraping function
exports.testScrape = async (req, res) => {
  try {
    const articles = await scrapeLatestNews();
    console.log("Scraped articles:", articles.length);
    
    res.json({ 
      success: true, 
      count: articles.length,
      sample: articles.slice(0, 3)
    });
  } catch (err) {
    console.error("Test scrape error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};