const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';

async function testDocumentUpload() {
  try {
    console.log('🧪 Testing Document Upload Functionality\n');

    // 1. Test backend health
    console.log('1. Testing backend health...');
    try {
      const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
      console.log('✅ Backend is running');
    } catch (error) {
      console.log('❌ Backend is not running. Please start the backend server first.');
      return;
    }

    // 2. Test admin login
    console.log('\n2. Testing admin login...');
    let token;
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'admin@asklegal.com',
        password: 'Admin123!'
      });
      token = loginResponse.data.token;
      console.log('✅ Admin login successful');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
      return;
    }

    // 3. Test Ollama connection
    console.log('\n3. Testing Ollama connection...');
    try {
      const ollamaResponse = await axios.get('http://localhost:11434/api/tags');
      console.log('✅ Ollama is running');
      console.log(`   Available models: ${ollamaResponse.data.models?.map(m => m.name).join(', ') || 'None'}`);
    } catch (error) {
      console.log('❌ Ollama is not running. Please start Ollama first.');
      console.log('   You can start Ollama with: ollama serve');
      console.log('   Then pull the required models:');
      console.log('   ollama pull llama2');
      console.log('   ollama pull nomic-embed-text');
    }

    // 4. Check uploads directory
    console.log('\n4. Checking uploads directory...');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('✅ Uploads directory exists');
    } else {
      console.log('❌ Uploads directory does not exist');
      fs.mkdirSync(uploadsDir);
      console.log('✅ Created uploads directory');
    }

    // 5. Test document list endpoint
    console.log('\n5. Testing document list endpoint...');
    try {
      const docsResponse = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ Document list endpoint working (${docsResponse.data.documents.length} documents)`);
    } catch (error) {
      console.log('❌ Document list endpoint failed:', error.response?.data?.message || error.message);
    }

    // 6. Create a test PDF file
    console.log('\n6. Creating test PDF file...');
    const testPdfPath = path.join(__dirname, 'test-document.pdf');
    
    // Create a simple text file that we'll pretend is a PDF for testing
    const testContent = `This is a test document for the RAG system.
    
    It contains legal information about Nepal.
    
    This document has multiple paragraphs to test chunking.
    
    The system should be able to process this document and create embeddings.
    
    This is the end of the test document.`;
    
    fs.writeFileSync(testPdfPath, testContent);
    console.log('✅ Test document created');

    // 7. Test file upload (simulate)
    console.log('\n7. Testing file upload simulation...');
    try {
      const formData = new FormData();
      formData.append('pdf', fs.createReadStream(testPdfPath));
      formData.append('title', 'Test Legal Document');
      formData.append('category', 'Legal');
      formData.append('tags', 'test, legal, nepal');
      formData.append('isPublic', 'true');
      formData.append('accessLevel', 'public');

      const uploadResponse = await axios.post(`${BACKEND_URL}/api/documents/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Document upload successful');
      console.log(`   Document ID: ${uploadResponse.data.document.id}`);
    } catch (error) {
      console.log('❌ Document upload failed:', error.response?.data?.message || error.message);
    }

    // 8. Clean up test file
    if (fs.existsSync(testPdfPath)) {
      fs.unlinkSync(testPdfPath);
      console.log('✅ Test file cleaned up');
    }

    console.log('\n🎉 Document upload test completed!');
    console.log('\nNext steps:');
    console.log('1. Start Ollama: ollama serve');
    console.log('2. Pull required models:');
    console.log('   ollama pull llama2');
    console.log('   ollama pull nomic-embed-text');
    console.log('3. Upload real PDF documents through the admin interface');
    console.log('4. Test the chatbot with uploaded documents');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDocumentUpload(); 