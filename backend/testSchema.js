require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

async function testSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Test with a simple document
    const testDoc = {
      title: "परीक्षण समाचार",
      source: "Test",
      url: `https://test.com/${Date.now()}`,
      language: "ne"
    };

    // Try saving with different approaches
    console.log("Attempting to save test document...");
    
    // Method 1: Direct create
    try {
      const saved = await News.create(testDoc);
      console.log("✅ Saved successfully with create():", saved);
    } catch (err) {
      console.error("❌ create() failed:", err.message);
    }

    // Method 2: Using collection directly
    try {
      const result = await News.collection.insertOne(testDoc);
      console.log("✅ Saved successfully with insertOne():", result);
    } catch (err) {
      console.error("❌ insertOne() failed:", err.message);
    }

    // Check collection schema
    const options = await News.collection.options();
    console.log("Collection options:", options);

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

testSchema();