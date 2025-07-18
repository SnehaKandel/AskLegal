const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testRoutes() {
  try {
    console.log('🧪 Testing Backend Routes\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
      console.log('✅ Health endpoint working');
    } catch (error) {
      console.log('❌ Health endpoint failed:', error.message);
      return;
    }

    // Test admin login
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

    // Test documents endpoint
    console.log('\n3. Testing documents endpoint...');
    try {
      const docsResponse = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Documents endpoint working');
      console.log(`   Found ${docsResponse.data.documents.length} documents`);
    } catch (error) {
      console.log('❌ Documents endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test upload-multiple endpoint (without file)
    console.log('\n4. Testing upload-multiple endpoint...');
    try {
      const uploadResponse = await axios.post(`${BACKEND_URL}/api/documents/upload-multiple`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'No files uploaded') {
        console.log('✅ Upload-multiple endpoint working (correctly rejected empty request)');
      } else {
        console.log('❌ Upload-multiple endpoint failed:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Route testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRoutes(); 