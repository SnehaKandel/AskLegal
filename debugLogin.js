const axios = require('axios');

const debugLogin = async () => {
  console.log('🔍 Debugging Login Issue...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1. Checking backend health...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/api/health');
      console.log('✅ Backend is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend is not running or not accessible');
      console.log('Error:', error.message);
      return;
    }

    // Test 2: Test login with admin credentials
    console.log('\n2. Testing admin login...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@asklegal.com',
        password: 'Admin123!'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin login successful');
      console.log('Response status:', loginResponse.status);
      console.log('Token received:', loginResponse.data.token ? 'YES' : 'NO');
      console.log('User data:', {
        name: loginResponse.data.user.name,
        email: loginResponse.data.user.email,
        role: loginResponse.data.user.role
      });
    } catch (error) {
      console.log('❌ Admin login failed');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message || error.response?.data);
      console.log('Full error:', error.response?.data);
    }

    // Test 3: Test login with user credentials
    console.log('\n3. Testing user login...');
    try {
      const userLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@asklegal.com',
        password: 'User123!'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ User login successful');
      console.log('Response status:', userLoginResponse.status);
      console.log('Token received:', userLoginResponse.data.token ? 'YES' : 'NO');
    } catch (error) {
      console.log('❌ User login failed');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message || error.response?.data);
    }

    // Test 4: Test with invalid credentials
    console.log('\n4. Testing invalid credentials...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Invalid login should have failed');
    } catch (error) {
      console.log('✅ Invalid login correctly rejected');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message || error.response?.data);
    }

    // Test 5: Check if users exist in database
    console.log('\n5. Checking database connection...');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${loginResponse?.data?.token || 'no-token'}`
        }
      });
      console.log('✅ Database connection working');
      console.log('Users in database:', response.data.users.length);
    } catch (error) {
      console.log('❌ Cannot access database or admin route');
      console.log('Error:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
};

debugLogin(); 