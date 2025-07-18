// A simple test script to run the scraper independently
const { scrapeLatestNews, scrapeArticleContent } = require('./newsScraper');

async function testScraper() {
  try {
    console.log('Starting news scraper test...');
    
    // Test scraping latest news
    const articles = await scrapeLatestNews();
    
    console.log(`Successfully scraped ${articles.length} articles`);
    
    // Display the first 3 articles or fewer if less than 3 are available
    const sampleSize = Math.min(3, articles.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const article = articles[i];
      console.log('\n----------------------------------------');
      console.log(`Article ${i+1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Source: ${article.source}`);
      console.log(`URL: ${article.url}`);
      console.log(`Published: ${article.publishedAt}`);
      console.log(`Summary: ${article.summary.substring(0, 100)}...`);
      console.log(`Language: ${article.language}`);
      console.log(`Image: ${article.imageUrl || 'None'}`);
      
      // Optionally test full content scraping for the first article
      if (i === 0 && article.url) {
        console.log('\nFetching full content for first article...');
        const content = await scrapeArticleContent(article.url);
        if (content) {
          console.log(`Content length: ${content.length} characters`);
          console.log(`Content preview: ${content.substring(0, 200)}...`);
        } else {
          console.log('Could not fetch full content');
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testScraper();