const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test database connection
const testDatabase = async () => {
  try {
    console.log('🗄️ Testing Database Connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asklegal');
    console.log('✅ Database connection successful');
    
    // Test basic operations
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`✅ Database operations working. Total users: ${userCount}`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
};

// Test server health
const testServerHealth = async () => {
  try {
    console.log('\n🏥 Testing Server Health...');
    const response = await axios.get(`${BASE_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ Server health check passed');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
};

// Test authentication
const testAuthentication = async () => {
  try {
    console.log('\n🔐 Testing Authentication...');
    
    // Test login with admin
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@asklegal.com',
      password: 'Admin123!',
      role: 'admin'
    }, {
      timeout: 5000
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test login with wrong password
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@asklegal.com',
        password: 'wrongpassword',
        role: 'admin'
      }, {
        timeout: 5000
      });
      console.log('❌ Login with wrong password should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Wrong password correctly rejected');
      } else {
        console.log('❌ Unexpected error with wrong password:', error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return false;
  }
};

// Test RAG endpoints
const testRAGEndpoints = async () => {
  try {
    console.log('\n🤖 Testing RAG Endpoints...');
    
    // Test RAG status
    const statusResponse = await axios.get(`${BASE_URL}/api/rag/status`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      timeout: 5000
    });
    console.log('✅ RAG status endpoint working');
    
    // Test RAG search
    const searchResponse = await axios.get(`${BASE_URL}/api/rag/search`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: { query: 'test query', limit: 5 },
      timeout: 5000
    });
    console.log('✅ RAG search endpoint working');
    
    // Test RAG generate
    const generateResponse = await axios.post(`${BASE_URL}/api/rag/generate`, {
      query: 'test query',
      context: 'test context'
    }, {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    console.log('✅ RAG generate endpoint working');
    
    return true;
  } catch (error) {
    console.error('❌ RAG endpoints test failed:', error.message);
    return false;
  }
};

// Test error handling
const testErrorHandling = async () => {
  try {
    console.log('\n🚨 Testing Error Handling...');
    
    // Test invalid token
    try {
      await axios.get(`${BASE_URL}/api/rag/status`, {
        headers: { 'Authorization': 'Bearer invalid_token' },
        timeout: 5000
      });
      console.log('❌ Invalid token should have been rejected');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('✅ Invalid token correctly rejected');
      } else {
        console.log('❌ Unexpected error with invalid token:', error.message);
      }
    }
    
    // Test missing token
    try {
      await axios.get(`${BASE_URL}/api/rag/status`, {
        timeout: 5000
      });
      console.log('❌ Missing token should have been rejected');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('✅ Missing token correctly rejected');
      } else {
        console.log('❌ Unexpected error with missing token:', error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message);
    return false;
  }
};

// Test connection stability
const testConnectionStability = async () => {
  try {
    console.log('\n🔗 Testing Connection Stability...');
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        axios.get(`${BASE_URL}/api/health`, { timeout: 3000 })
          .then(() => console.log(`✅ Request ${i + 1} successful`))
          .catch(err => console.log(`❌ Request ${i + 1} failed:`, err.message))
      );
    }
    
    await Promise.all(promises);
    console.log('✅ Connection stability test completed');
    return true;
  } catch (error) {
    console.error('❌ Connection stability test failed:', error.message);
    return false;
  }
};

// Main test function
const runComprehensiveTests = async () => {
  console.log('🚀 Starting Comprehensive System Tests...\n');
  
  const results = {
    database: await testDatabase(),
    serverHealth: await testServerHealth(),
    authentication: await testAuthentication(),
    ragEndpoints: await testRAGEndpoints(),
    errorHandling: await testErrorHandling(),
    connectionStability: await testConnectionStability()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('─'.repeat(50));
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\n' + '─'.repeat(50));
  console.log(allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed');
  
  if (!allPassed) {
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Ensure MongoDB is running');
    console.log('2. Ensure Redis is running');
    console.log('3. Check if backend server is running on port 5000');
    console.log('4. Verify network connectivity');
    console.log('5. Check server logs for detailed error messages');
  }
};

// Run the tests
runComprehensiveTests().catch(console.error); 