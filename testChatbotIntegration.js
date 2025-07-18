const axios = require('axios');

const testChatbotIntegration = async () => {
  console.log('🧪 Testing Chatbot Integration...\n');

  try {
    // Test 1: Check if the backend is running
    console.log('1. Testing backend connectivity...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthResponse.data.message);

    // Test 2: Test authentication
    console.log('\n2. Testing authentication...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@asklegal.com',
      password: 'Admin123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful');

    // Test 3: Test RAG chat endpoint
    console.log('\n3. Testing RAG chat endpoint...');
    const chatResponse = await axios.post('http://localhost:5000/api/rag/chat', {
      message: 'What are the requirements for starting a business in Nepal?',
      contextLimit: 3
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ RAG chat endpoint working');
    console.log('Response:', chatResponse.data.response.substring(0, 100) + '...');

    // Test 4: Test document upload (if any documents exist)
    console.log('\n4. Testing document listing...');
    const docsResponse = await axios.get('http://localhost:5000/api/documents', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Document listing working');
    console.log(`Found ${docsResponse.data.documents.length} documents`);

    console.log('\n🎉 All chatbot integration tests passed!');
    console.log('\n📝 Summary:');
    console.log('- Backend is running and healthy');
    console.log('- Authentication is working');
    console.log('- RAG chat endpoint is functional');
    console.log('- Document management is accessible');
    console.log('\n✨ The chatbot is now integrated into the homepage and ready to use!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
    
    if (error.response?.status === 401) {
      console.log('\n💡 Make sure you have the correct admin credentials:');
      console.log('   Email: admin@asklegal.com');
      console.log('   Password: Admin123!');
    }
  }
};

testChatbotIntegration(); 