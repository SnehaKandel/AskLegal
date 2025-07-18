require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

async function testSave() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First test - successful save
    const testArticle = {
      title: "Test Article",
      source: "Test Source",
      url: `https://test.com/${Date.now()}`,
      publishedAt: new Date(),
      summary: "This is a test article"
    };

    console.log('\n=== TEST 1: Saving new article ===');
    const saved = await News.create(testArticle);
    console.log('✅ Saved successfully:', saved._id);

    // Second test - duplicate URL
    console.log('\n=== TEST 2: Testing duplicate URL ===');
    try {
      await News.create(testArticle);
    } catch (err) {
      console.log('✅ Correctly caught duplicate error:', err.message);
    }

    // Third test - validation error
    console.log('\n=== TEST 3: Testing validation ===');
    try {
      await News.create({
        source: "Test Source",
        url: `https://test.com/${Date.now()}`
        // Missing required title and publishedAt
      });
    } catch (err) {
      console.log('✅ Correctly caught validation error:', err.message);
    }

  } catch (err) {
    console.error('❌ Overall test error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testSave();