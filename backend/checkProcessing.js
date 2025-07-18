const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BACKEND_URL = 'http://localhost:5000';

async function checkProcessing() {
  try {
    console.log('🔍 Checking Document Processing Status\n');

    // Connect to MongoDB directly
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all documents
    const Document = require('./models/Document');
    const documents = await Document.find({}).sort({ createdAt: -1 });

    console.log(`📊 Found ${documents.length} total documents\n`);

    documents.forEach((doc, index) => {
      const status = doc.status;
      const statusIcon = status === 'processed' ? '✅' : status === 'processing' ? '⏳' : '❌';
      const size = (doc.fileSize / 1024).toFixed(1);
      
      console.log(`${index + 1}. ${statusIcon} ${doc.title}`);
      console.log(`   Status: ${status}`);
      console.log(`   Size: ${size} KB`);
      console.log(`   Created: ${doc.createdAt.toLocaleString()}`);
      
      if (status === 'processing') {
        console.log(`   Progress: ${doc.processedChunks || 0}/${doc.totalChunks || 0} chunks`);
      }
      
      if (status === 'error') {
        console.log(`   Error: ${doc.processingError}`);
      }
      
      if (status === 'processed') {
        console.log(`   Pages: ${doc.metadata.pages || 'N/A'}`);
        console.log(`   Text Length: ${doc.metadata.textLength || 'N/A'} chars`);
      }
      
      console.log('');
    });

    // Check VectorChunks
    const VectorChunk = require('./models/VectorChunk');
    const chunkCount = await VectorChunk.countDocuments();
    console.log(`📚 Total Vector Chunks: ${chunkCount}`);

    // Check Ollama status
    console.log('\n🤖 Checking Ollama Status...');
    try {
      const ollamaResponse = await axios.get('http://localhost:11434/api/tags');
      console.log('✅ Ollama is running');
      console.log(`   Available models: ${ollamaResponse.data.models?.map(m => m.name).join(', ')}`);
    } catch (error) {
      console.log('❌ Ollama is not running or not accessible');
    }

    console.log('\n💡 Tips:');
    console.log('- Processing time depends on document size and Ollama performance');
    console.log('- Large documents (100+ pages) may take several minutes');
    console.log('- Check Ollama logs for processing details');
    console.log('- Restart Ollama if processing seems stuck');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the check
checkProcessing(); 