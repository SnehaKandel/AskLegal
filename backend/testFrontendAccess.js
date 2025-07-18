const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testFrontendAccess() {
  try {
    console.log('🌐 Testing Frontend Access to Documents\n');

    // 1. Test admin login (simulate frontend login)
    console.log('1. Simulating frontend login...');
    let token;
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'admin@asklegal.com',
        password: 'Admin123!'
      });
      token = loginResponse.data.token;
      console.log('✅ Login successful');
      console.log('   Token length:', token.length);
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return;
    }

    // 2. Test documents endpoint (exactly like frontend)
    console.log('\n2. Testing documents endpoint (frontend style)...');
    try {
      const response = await fetch(`${BACKEND_URL}/api/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('   Response status:', response.status);
      console.log('   Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('   Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Documents fetched successfully');
      console.log(`   Found ${data.documents.length} documents`);
      console.log(`   Total: ${data.total}`);
      
      if (data.documents.length > 0) {
        console.log('   Sample document:', {
          id: data.documents[0]._id,
          title: data.documents[0].title,
          status: data.documents[0].status
        });
      }

    } catch (error) {
      console.log('❌ Documents fetch failed:', error.message);
    }

    // 3. Test with axios (like the frontend API service)
    console.log('\n3. Testing with axios (like frontend API service)...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Axios request successful');
      console.log(`   Found ${response.data.documents.length} documents`);
      
    } catch (error) {
      console.log('❌ Axios request failed:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // 4. Test authentication token validity
    console.log('\n4. Testing token validity...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Token is valid');
      console.log('   User:', response.data.user.email);
      console.log('   Role:', response.data.user.role);
    } catch (error) {
      console.log('❌ Token validation failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Frontend Access Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFrontendAccess(); 