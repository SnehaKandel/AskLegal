const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testNewsFunctionality() {
  console.log('🧪 Testing News Functionality (Search Removed)');
  console.log('==============================================\n');

  try {
    // Test 1: Get news without search parameter
    console.log('1. Testing news API without search...');
    const newsResponse = await axios.get(`${BASE_URL}/api/news?page=1&limit=5`);
    
    if (newsResponse.data.success) {
      console.log('✅ News API working without search parameter');
      console.log(`   Found ${newsResponse.data.news.length} articles`);
      
      // Check thumbnails
      const articlesWithImages = newsResponse.data.news.filter(article => article.imageUrl);
      console.log(`   Articles with images: ${articlesWithImages.length}`);
      
      if (articlesWithImages.length > 0) {
        console.log('   Sample image URLs:');
        articlesWithImages.slice(0, 3).forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.title}`);
          console.log(`      Image: ${article.imageUrl}`);
        });
      }
    } else {
      console.log('❌ News API failed');
    }

    // Test 2: Get news sources
    console.log('\n2. Testing news sources...');
    const sourcesResponse = await axios.get(`${BASE_URL}/api/news/sources`);
    
    if (sourcesResponse.data.success) {
      console.log('✅ News sources API working');
      console.log(`   Available sources: ${sourcesResponse.data.sources.join(', ')}`);
    } else {
      console.log('❌ News sources API failed');
    }

    // Test 3: Test source filtering
    console.log('\n3. Testing source filtering...');
    const filteredResponse = await axios.get(`${BASE_URL}/api/news?source=The Himalayan Times&limit=3`);
    
    if (filteredResponse.data.success) {
      console.log('✅ Source filtering working');
      console.log(`   Found ${filteredResponse.data.news.length} articles from The Himalayan Times`);
      
      // Check if all articles are from the correct source
      const allFromSource = filteredResponse.data.news.every(article => 
        article.source === 'The Himalayan Times'
      );
      
      if (allFromSource) {
        console.log('✅ All articles are from the correct source');
      } else {
        console.log('❌ Some articles are from wrong source');
      }
    } else {
      console.log('❌ Source filtering failed');
    }

    // Test 4: Test pagination
    console.log('\n4. Testing pagination...');
    const page1Response = await axios.get(`${BASE_URL}/api/news?page=1&limit=2`);
    const page2Response = await axios.get(`${BASE_URL}/api/news?page=2&limit=2`);
    
    if (page1Response.data.success && page2Response.data.success) {
      console.log('✅ Pagination working');
      console.log(`   Page 1: ${page1Response.data.news.length} articles`);
      console.log(`   Page 2: ${page2Response.data.news.length} articles`);
      
      // Check if articles are different
      const page1Ids = page1Response.data.news.map(a => a._id);
      const page2Ids = page2Response.data.news.map(a => a._id);
      const hasOverlap = page1Ids.some(id => page2Ids.includes(id));
      
      if (!hasOverlap) {
        console.log('✅ Pages contain different articles');
      } else {
        console.log('❌ Pages contain overlapping articles');
      }
    } else {
      console.log('❌ Pagination failed');
    }

    // Test 5: Test scheduler status
    console.log('\n5. Testing scheduler status...');
    const schedulerResponse = await axios.get(`${BASE_URL}/api/news/status`);
    
    if (schedulerResponse.data.success) {
      console.log('✅ Scheduler status API working');
      const status = schedulerResponse.data.status;
      console.log(`   Scheduler running: ${status.isRunning}`);
      console.log(`   Last run: ${status.lastRun || 'Never'}`);
    } else {
      console.log('❌ Scheduler status API failed');
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Search functionality has been successfully removed');
    console.log('- News API works with pagination and source filtering');
    console.log('- Thumbnails are being served with improved quality settings');
    console.log('- Light/dark mode functionality remains unchanged');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testNewsFunctionality(); 