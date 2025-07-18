require('dotenv').config();
const mongoose = require('mongoose');
const { scrapeLatestNews } = require('./services/newsScraper');
const News = require('./models/News');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Test with a single article first
  const testArticle = {
    title: "परीक्षण समाचार",
    source: "OnlineKhabar",
    url: "https://example.com/test-" + Date.now(),
    summary: "यो एक परीक्षण समाचार हो",
    language: "ne",
    publishedAt: new Date()
  };

  try {
    const saved = await News.create(testArticle);
    console.log('✅ Test article saved:', saved);
  } catch (err) {
    console.error('❌ Test save failed:', err);
  }

  // Now test with actual scraping
  console.log('Starting full scrape test...');
  const articles = await scrapeLatestNews();
  console.log(`Scraped ${articles.length} articles`);
  
  for (const article of articles.slice(0, 5)) { // Just test first 5
    try {
      const saved = await News.create(article);
      console.log(`✅ Saved: ${saved.title}`);
    } catch (err) {
      console.error(`❌ Failed to save "${article.title}":`, err.message);
    }
  }

  await mongoose.disconnect();
}

test();