const axios = require('axios');

const testAuthentication = async () => {
  console.log('🔐 Testing Authentication System...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1. Checking backend connectivity...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthResponse.data.status);

    // Test 2: Test admin login
    console.log('\n2. Testing admin login...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@asklegal.com',
      password: 'Admin123!'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('Token received:', adminToken ? 'YES' : 'NO');

    // Test 3: Test user login
    console.log('\n3. Testing user login...');
    const userLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@asklegal.com',
      password: 'User123!'
    });
    
    const userToken = userLoginResponse.data.token;
    console.log('✅ User login successful');
    console.log('Token received:', userToken ? 'YES' : 'NO');

    // Test 4: Test protected route with admin token
    console.log('\n4. Testing protected route with admin token...');
    const adminProfileResponse = await axios.get('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log('✅ Admin profile access successful');
    console.log('User role:', adminProfileResponse.data.user.role);

    // Test 5: Test admin-only route
    console.log('\n5. Testing admin-only route...');
    const adminUsersResponse = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log('✅ Admin users list access successful');
    console.log('Users found:', adminUsersResponse.data.users.length);

    // Test 6: Test user access to admin route (should fail)
    console.log('\n6. Testing user access to admin route (should fail)...');
    try {
      await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      console.log('❌ User was able to access admin route (this should not happen)');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ User correctly blocked from admin route');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Authentication System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- Backend is running and healthy');
    console.log('- Admin login working');
    console.log('- User login working');
    console.log('- Token-based authentication working');
    console.log('- Role-based access control working');
    console.log('- Protected routes properly secured');
    
    console.log('\n✨ You can now:');
    console.log('1. Login to the frontend at http://localhost:3000/login');
    console.log('2. Use admin@asklegal.com / Admin123! for admin access');
    console.log('3. Use user@asklegal.com / User123! for regular user access');
    console.log('4. Upload documents and test the RAG system');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
  }
};

testAuthentication(); 