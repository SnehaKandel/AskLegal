const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test login and get token
const login = async () => {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@asklegal.com',
      password: 'Admin123!',
      role: 'admin'
    });

    authToken = response.data.token;
    console.log('✅ Login successful');
    console.log(`Token: ${authToken.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
};

// Test RAG status endpoint
const testRAGStatus = async () => {
  try {
    console.log('\n🔍 Testing RAG Status endpoint...');
    const response = await axios.get(`${BASE_URL}/api/rag/status`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ RAG Status Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ RAG Status test failed:', error.response?.data || error.message);
    return false;
  }
};

// Test RAG search endpoint
const testRAGSearch = async () => {
  try {
    console.log('\n🔍 Testing RAG Search endpoint...');
    const response = await axios.get(`${BASE_URL}/api/rag/search`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        query: 'What are the legal requirements for starting a business in Nepal?',
        limit: 5
      }
    });

    console.log('✅ RAG Search Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ RAG Search test failed:', error.response?.data || error.message);
    return false;
  }
};

// Test RAG generate endpoint
const testRAGGenerate = async () => {
  try {
    console.log('\n🤖 Testing RAG Generate endpoint...');
    const response = await axios.post(`${BASE_URL}/api/rag/generate`, {
      query: 'Explain the process of filing a lawsuit in Nepal',
      context: 'Focus on civil court procedures'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ RAG Generate Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ RAG Generate test failed:', error.response?.data || error.message);
    return false;
  }
};

// Test health endpoint
const testHealth = async () => {
  try {
    console.log('\n🏥 Testing Health endpoint...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Health test failed:', error.response?.data || error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting RAG Functionality Tests...\n');

  // Test health first
  await testHealth();

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without authentication');
    return;
  }

  // Test RAG endpoints
  await testRAGStatus();
  await testRAGSearch();
  await testRAGGenerate();

  console.log('\n🎉 All tests completed!');
};

// Run the tests
runTests().catch(console.error); 