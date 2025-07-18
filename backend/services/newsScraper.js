const cheerio = require('cheerio');
const axios = require('axios');
const { parseDate } = require('chrono-node');


const debugLog = (message, obj = null) => {
  console.log(`[DEBUG] ${message}`);
  if (obj) console.log(JSON.stringify(obj, null, 2));
};

const cleanText = (text) => {
  return text.replace(/\s+/g, ' ').trim();
};

// Helper function to extract date from string
const extractDate = (dateString) => {
  try {
    if (!dateString) return new Date();
    
    // Remove any "Updated" or "Published" prefixes
    dateString = dateString.replace(/^(Updated|Published):\s*/i, '');
    
    // Replace future years with current year
    const currentYear = new Date().getFullYear();
    dateString = dateString.replace(/\b202[4-9]\b/g, currentYear.toString());
    
    // Try to parse the date
    const parsed = parseDate(dateString);
    if (parsed) {
      // Ensure the date is not in the future
      const now = new Date();
      if (parsed > now) {
        return now;
      }
      return parsed;
    }
    return new Date();
  } catch (e) {
    return new Date();
  }
};

// Main scraping function for The Himalayan Times
const scrapeHimalayanTimes = async () => {
  try {
    const url = 'https://thehimalayantimes.com';
    debugLog(`Scraping The Himalayan Times at ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 15000
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP status ${response.status}`);
    }
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Scrape main articles from homepage
    $('.post-card, article, .featured-post').each((i, el) => {
      try {
        const titleEl = $(el).find('h2, h3, .title, .heading').first();
        const title = cleanText(titleEl.text());
        
        let articleUrl = titleEl.attr('href') || $(el).find('a').first().attr('href');
        if (!title || !articleUrl || title.length < 10) return;
        
        // Make URL absolute if needed
        if (!articleUrl.startsWith('http')) {
          articleUrl = new URL(articleUrl, url).href;
        }
        
        // Get summary
        const summary = cleanText($(el).find('.excerpt, .summary, .entry-content p, .post-excerpt, article p').first().text()) || 'No summary available';
        
        // Get image
        let imageUrl = '';
        const imgEl = $(el).find('img').first();
        if (imgEl.length) {
          // Prefer srcset/data-srcset for high-res images
          let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
          if (srcset) {
            // srcset format: "url1 size1, url2 size2, ..."
            const candidates = srcset.split(',').map(s => s.trim().split(' '));
            // Pick the largest image (last in the list)
            const best = candidates[candidates.length - 1][0];
            imageUrl = best;
          } else {
            imageUrl = imgEl.attr('src') || imgEl.attr('data-src');
          }
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, url).href;
          }
        }
        
        // Get date
        const dateText = cleanText($(el).find('.date, time, .published-date').first().text());
        const publishedAt = extractDate(dateText);
        
        articles.push({
          title,
          source: 'The Himalayan Times',
          url: articleUrl,
          publishedAt,
          summary,
          language: 'en',
          imageUrl
        });
      } catch (err) {
        debugLog(`Error processing Himalayan Times article: ${err.message}`);
      }
    });
    
    // Scrape category pages
    const categories = ['nepal', 'world', 'business', 'sports', 'entertainment'];
    for (const category of categories) {
      try {
        const categoryUrl = new URL(category, url).href;
        debugLog(`Scraping Himalayan Times category: ${categoryUrl}`);
        
        const catResponse = await axios.get(categoryUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000
        });
        
        const $cat = cheerio.load(catResponse.data);
        
        $cat('.article-item, .news-item, .trending-item').each((i, el) => {
          try {
            const titleEl = $cat(el).find('h2, h3, .title').first();
            const title = cleanText(titleEl.text());
            
            let articleUrl = titleEl.attr('href') || $cat(el).find('a').first().attr('href');
            if (!title || !articleUrl || title.length < 10) return;
            
            if (!articleUrl.startsWith('http')) {
              articleUrl = new URL(articleUrl, categoryUrl).href;
            }
            
            // Skip duplicates
            if (articles.some(a => a.url === articleUrl)) return;
            
            const summary = cleanText($cat(el).find('p, .excerpt').first().text()) || 'No summary available';
            
            let imageUrl = '';
            const imgEl = $cat(el).find('img').first();
            if (imgEl.length) {
              let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
              if (srcset) {
                const candidates = srcset.split(',').map(s => s.trim().split(' '));
                const best = candidates[candidates.length - 1][0];
                imageUrl = best;
              } else {
                imageUrl = imgEl.attr('src') || imgEl.attr('data-src');
              }
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, categoryUrl).href;
              }
            }
            
            const dateText = cleanText($cat(el).find('.date, time').first().text());
            const publishedAt = extractDate(dateText);
            
            articles.push({
              title,
              source: 'The Himalayan Times',
              url: articleUrl,
              publishedAt,
              summary,
              language: 'en',
              imageUrl
            });
          } catch (err) {
            debugLog(`Error processing Himalayan Times category article: ${err.message}`);
          }
        });
      } catch (err) {
        debugLog(`Error scraping Himalayan Times category ${category}: ${err.message}`);
      }
    }
    
    debugLog(`Found ${articles.length} Himalayan Times articles`);
    return articles;
  } catch (err) {
    debugLog(`Error scraping The Himalayan Times: ${err.message}`);
    return [];
  }
};

// Main scraping function for Kathmandu Post
const scrapeKathmanduPost = async () => {
  try {
    const url = 'https://kathmandupost.com';
    debugLog(`Scraping Kathmandu Post at ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 15000
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP status ${response.status}`);
    }
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Scrape main articles from homepage
    $('.block--morenews, .article-image, .card__details').each((i, el) => {
      try {
        const titleEl = $(el).find('h2, h3, .card__title').first();
        const title = cleanText(titleEl.text());
        
        let articleUrl = titleEl.attr('href') || $(el).find('a').first().attr('href');
        if (!title || !articleUrl || title.length < 10) return;
        
        // Make URL absolute if needed
        if (!articleUrl.startsWith('http')) {
          articleUrl = new URL(articleUrl, url).href;
        }
        
        // Get summary
        const summary = cleanText($(el).find('p, .card__excerpt').first().text()) || 'No summary available';
        
        // Get image
        let imageUrl = '';
        const imgEl = $(el).find('img').first();
        if (imgEl.length) {
          // Prefer srcset/data-srcset for high-res images
          let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
          if (srcset) {
            // srcset format: "url1 size1, url2 size2, ..."
            const candidates = srcset.split(',').map(s => s.trim().split(' '));
            // Pick the largest image (last in the list)
            const best = candidates[candidates.length - 1][0];
            imageUrl = best;
          } else {
            imageUrl = imgEl.attr('src') || imgEl.attr('data-src');
          }
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, url).href;
          }
        }
        
        // Get date
        const dateText = cleanText($(el).find('.card__date, time').first().text());
        const publishedAt = extractDate(dateText);
        
        articles.push({
          title,
          source: 'Kathmandu Post',
          url: articleUrl,
          publishedAt,
          summary,
          language: 'en',
          imageUrl
        });
      } catch (err) {
        debugLog(`Error processing Kathmandu Post article: ${err.message}`);
      }
    });
    
    // Scrape category pages
    const categories = ['/national', '/business', '/sports', '/opinion'];
    for (const category of categories) {
      try {
        const categoryUrl = new URL(category, url).href;
        debugLog(`Scraping Kathmandu Post category: ${categoryUrl}`);
        
        const catResponse = await axios.get(categoryUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000
        });
        
        const $cat = cheerio.load(catResponse.data);
        
        $cat('.block--morenews, .article-image, .card__details').each((i, el) => {
          try {
            const titleEl = $cat(el).find('h2, h3, .card__title').first();
            const title = cleanText(titleEl.text());
            
            let articleUrl = titleEl.attr('href') || $cat(el).find('a').first().attr('href');
            if (!title || !articleUrl || title.length < 10) return;
            
            if (!articleUrl.startsWith('http')) {
              articleUrl = new URL(articleUrl, categoryUrl).href;
            }
            
            // Skip duplicates
            if (articles.some(a => a.url === articleUrl)) return;
            
            const summary = cleanText($cat(el).find('p, .card__excerpt').first().text()) || 'No summary available';
            
            let imageUrl = '';
            const imgEl = $cat(el).find('img').first();
            if (imgEl.length) {
              let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
              if (srcset) {
                const candidates = srcset.split(',').map(s => s.trim().split(' '));
                const best = candidates[candidates.length - 1][0];
                imageUrl = best;
              } else {
                imageUrl = imgEl.attr('src') || imgEl.attr('data-src');
              }
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, categoryUrl).href;
              }
            }
            
            const dateText = cleanText($cat(el).find('.card__date, time').first().text());
            const publishedAt = extractDate(dateText);
            
            articles.push({
              title,
              source: 'Kathmandu Post',
              url: articleUrl,
              publishedAt,
              summary,
              language: 'en',
              imageUrl
            });
          } catch (err) {
            debugLog(`Error processing Kathmandu Post category article: ${err.message}`);
          }
        });
      } catch (err) {
        debugLog(`Error scraping Kathmandu Post category ${category}: ${err.message}`);
      }
    }
    
    debugLog(`Found ${articles.length} Kathmandu Post articles`);
    return articles;
  } catch (err) {
    debugLog(`Error scraping Kathmandu Post: ${err.message}`);
    return [];
  }
};

// Function to get full article content
const scrapeArticleContent = async (url) => {
  try {
    debugLog(`Scraping content from: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 20000
    });
    
    const $ = cheerio.load(response.data);
    let content = '';
    
    if (url.includes('thehimalayantimes.com')) {
      // Himalayan Times content extraction
      const contentEl = $('.detail-content, .article-content, .article-body');
      contentEl.find('script, style, iframe, .ad-container').remove();
      content = contentEl.html() || $('article').html();
    } else if (url.includes('kathmandupost.com')) {
      // Kathmandu Post content extraction
      const contentEl = $('.story__content, .article-content, .content-area');
      contentEl.find('script, style, iframe, .ad-container').remove();
      content = contentEl.html() || $('article').html();
    }
    
    return content ? cleanText(content) : 'Content not found';
  } catch (err) {
    debugLog(`Error scraping article content: ${err.message}`);
    return null;
  }
};

// Main function to scrape all sources
const scrapeLatestNews = async () => {
  try {
    debugLog('Starting to scrape all sources');
    
    const [himalayanTimesArticles, kathmanduPostArticles] = await Promise.all([
      scrapeHimalayanTimes(),
      scrapeKathmanduPost()
    ]);
    
    const allArticles = [...himalayanTimesArticles, ...kathmanduPostArticles];
    
    // Remove duplicates based on URL
    const uniqueArticles = [];
    const urls = new Set();
    
    allArticles.forEach(article => {
      if (!urls.has(article.url)) {
        urls.add(article.url);
        uniqueArticles.push(article);
      }
    });
    
    debugLog(`Total articles scraped: ${uniqueArticles.length}`);
    return uniqueArticles;
  } catch (err) {
    debugLog(`Error in scrapeLatestNews: ${err.message}`);
    throw err;
  }
};

// If running this file directly, execute a test
if (require.main === module) {
  (async () => {
    console.log('----- STARTING ENGLISH NEWS SCRAPER TEST -----');
    
    try {
      const articles = await scrapeLatestNews();
      
      console.log(`\nTotal articles found: ${articles.length}`);
      
      // Group by source
      const bySite = {
        'The Himalayan Times': articles.filter(a => a.source === 'The Himalayan Times'),
        'Kathmandu Post': articles.filter(a => a.source === 'Kathmandu Post')
      };
      
      console.log(`The Himalayan Times articles: ${bySite['The Himalayan Times'].length}`);
      console.log(`Kathmandu Post articles: ${bySite['Kathmandu Post'].length}`);
      
      // Display sample of articles from each source
      for (const source of Object.keys(bySite)) {
        console.log(`\n----- ${source} Articles -----`);
        
        bySite[source].slice(0, 3).forEach((article, i) => {
          console.log(`\nArticle ${i+1}:`);
          console.log(`Title: ${article.title}`);
          console.log(`URL: ${article.url}`);
          console.log(`Summary: ${article.summary.substring(0, 100)}...`);
          console.log(`Date: ${article.publishedAt}`);
          console.log(`Image: ${article.imageUrl || 'None'}`);
        });
      }
      
      // Optionally fetch full content for first article
      if (articles.length > 0) {
        console.log('\nFetching full content for first article...');
        const content = await scrapeArticleContent(articles[0].url);
        if (content) {
          console.log(`Content length: ${content.length} characters`);
          console.log(`First 200 chars: ${content.substring(0, 200)}...`);
        }
      }
      
      console.log('\n----- SCRAPER TEST COMPLETE -----');
    } catch (error) {
      console.error('Test failed:', error);
    }
  })();
}

// Export functions for use with controller
module.exports = {
  scrapeLatestNews,
  scrapeArticleContent,
  scrapeHimalayanTimes,
  scrapeKathmanduPost
};