const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testDocuments() {
  try {
    console.log('📄 Testing Documents System\n');

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

    // 2. Test get all documents
    console.log('\n2. Testing get all documents...');
    try {
      const documentsResponse = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Documents endpoint working');
      console.log(`   Found ${documentsResponse.data.documents.length} documents`);
      console.log(`   Total: ${documentsResponse.data.total}`);
      
      if (documentsResponse.data.documents.length > 0) {
        console.log('   Sample document:', {
          title: documentsResponse.data.documents[0].title,
          status: documentsResponse.data.documents[0].status,
          size: documentsResponse.data.documents[0].fileSize
        });
      }
    } catch (error) {
      console.log('❌ Documents endpoint failed:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // 3. Test document search
    console.log('\n3. Testing document search...');
    try {
      const searchResponse = await axios.get(`${BACKEND_URL}/api/documents?search=divorce`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Document search working');
      console.log(`   Found ${searchResponse.data.documents.length} documents matching "divorce"`);
    } catch (error) {
      console.log('❌ Document search failed:', error.response?.data?.message || error.message);
    }

    // 4. Test document status
    console.log('\n4. Testing document status...');
    try {
      const statusResponse = await axios.get(`${BACKEND_URL}/api/documents/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Document status endpoint working');
      console.log('   Status:', statusResponse.data);
    } catch (error) {
      console.log('❌ Document status failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Documents Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDocuments(); 