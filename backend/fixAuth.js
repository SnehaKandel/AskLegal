require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const fixAuthentication = async () => {
  console.log('🔧 Fixing Authentication System...\n');

  try {
    // Connect to database
    console.log('1. Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');

    // Check if admin user exists
    console.log('\n2. Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@asklegal.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@asklegal.com');
      console.log('Role:', existingAdmin.role);
      console.log('Status:', existingAdmin.status);
    } else {
      console.log('❌ Admin user not found, creating...');
      
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@asklegal.com',
        password: 'Admin123!',
        role: 'admin',
        status: 'active'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@asklegal.com');
      console.log('Password: Admin123!');
    }

    // Create a regular user for testing
    console.log('\n3. Creating test user...');
    const existingUser = await User.findOne({ email: 'user@asklegal.com' });
    
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Email: user@asklegal.com');
    } else {
      const testUser = new User({
        name: 'Test User',
        email: 'user@asklegal.com',
        password: 'User123!',
        role: 'user',
        status: 'active'
      });

      await testUser.save();
      console.log('✅ Test user created successfully');
      console.log('Email: user@asklegal.com');
      console.log('Password: User123!');
    }

    // List all users
    console.log('\n4. Current users in database:');
    const allUsers = await User.find({}).select('-password -refreshToken');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.status}`);
    });

    console.log('\n🎉 Authentication system fixed!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@asklegal.com / Admin123!');
    console.log('User: user@asklegal.com / User123!');
    
    console.log('\n💡 Next steps:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Test login at: http://localhost:5000/api/auth/login');
    console.log('3. Start the frontend: cd ../dharma-patra-builder && npm run dev');

  } catch (error) {
    console.error('❌ Error fixing authentication:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n💡 Make sure MongoDB is running:');
      console.log('   mongod');
    }
  } finally {
    mongoose.connection.close();
  }
};

fixAuthentication(); 