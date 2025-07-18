require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

const testArticle = {
  title: "TEST TITLE",
  source: "TEST SOURCE",
  url: "https://test.com",
  publishedAt: new Date(),
  summary: "Test summary",
  language: "en"
};

async function testSave() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Saving test article...');
    const saved = await News.create(testArticle);
    console.log('✅ Saved successfully:', saved);
  } catch (err) {
    console.error('❌ Save failed:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

testSave();