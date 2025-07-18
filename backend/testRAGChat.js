const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testRAGChat() {
  try {
    console.log('🤖 Testing RAG Chat System\n');

    // 1. Test admin login
    console.log('1. Logging in as admin...');
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

    // 2. Test RAG status
    console.log('\n2. Testing RAG status...');
    try {
      const statusResponse = await axios.get(`${BACKEND_URL}/api/rag/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ RAG status endpoint working');
      console.log('   Status:', statusResponse.data.status);
      console.log('   Ollama:', statusResponse.data.ollama.status);
    } catch (error) {
      console.log('❌ RAG status failed:', error.response?.data?.message || error.message);
    }

    // 3. Test document search
    console.log('\n3. Testing document search...');
    try {
      const searchResponse = await axios.get(`${BACKEND_URL}/api/rag/search?query=divorce&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Document search working');
      console.log(`   Found ${searchResponse.data.results.length} results`);
      
      if (searchResponse.data.results.length > 0) {
        console.log('   Top result:', searchResponse.data.results[0].content.substring(0, 100) + '...');
      }
    } catch (error) {
      console.log('❌ Document search failed:', error.response?.data?.message || error.message);
    }

    // 4. Test RAG chat
    console.log('\n4. Testing RAG chat...');
    try {
      const chatResponse = await axios.post(`${BACKEND_URL}/api/rag/chat`, {
        message: 'What are the grounds for divorce in Nepal?',
        contextLimit: 3
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ RAG chat working!');
      console.log('   Response:', chatResponse.data.response.substring(0, 200) + '...');
      console.log(`   Sources: ${chatResponse.data.sources.length} documents`);
      console.log(`   Confidence: ${chatResponse.data.confidence || 'N/A'}`);
      
    } catch (error) {
      console.log('❌ RAG chat failed:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // 5. Test Ollama directly
    console.log('\n5. Testing Ollama directly...');
    try {
      const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama2',
        prompt: 'Hello, this is a test.',
        stream: false
      });
      console.log('✅ Ollama generation working');
      console.log('   Response:', ollamaResponse.data.response.substring(0, 50) + '...');
    } catch (error) {
      console.log('❌ Ollama generation failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 RAG Chat Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRAGChat(); 