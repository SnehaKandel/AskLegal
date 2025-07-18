const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

const testAdminAPI = async () => {
  try {
    console.log('🔐 Testing Admin API...\n');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@asklegal.com',
      password: 'Admin123!',
      role: 'admin'
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Login successful\n');
    
    // 2. Test admin users endpoint
    console.log('2. Testing admin users endpoint...');
    const usersResponse = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: { page: 1, limit: 10 }
    });
    
    console.log('✅ Admin users endpoint working');
    console.log(`Found ${usersResponse.data.count} users`);
    console.log(`Total users: ${usersResponse.data.total}`);
    console.log(`Current page: ${usersResponse.data.page}`);
    console.log(`Total pages: ${usersResponse.data.pages}\n`);
    
    // 3. Display users
    console.log('3. User list:');
    usersResponse.data.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Status: ${user.status}`);
      console.log('');
    });
    
    console.log('🎉 Admin API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Admin API test failed:', error.response?.data || error.message);
  }
};

testAdminAPI(); 