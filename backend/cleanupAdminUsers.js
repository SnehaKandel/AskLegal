const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function cleanupAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users:`);
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt}`);
    });

    if (adminUsers.length > 1) {
      // Keep the first admin user, delete the rest
      const [keepUser, ...deleteUsers] = adminUsers;
      
      console.log(`\nKeeping admin user: ${keepUser.email}`);
      console.log(`Deleting ${deleteUsers.length} duplicate admin users...`);
      
      for (const user of deleteUsers) {
        await User.findByIdAndDelete(user._id);
        console.log(`Deleted: ${user.email}`);
      }
      
      console.log('\n✅ Admin user cleanup completed!');
    } else if (adminUsers.length === 1) {
      console.log('\n✅ Only one admin user exists - no cleanup needed');
    } else {
      console.log('\n⚠️ No admin users found');
    }

    // Verify final state
    const finalAdminUsers = await User.find({ role: 'admin' });
    console.log(`\nFinal admin user count: ${finalAdminUsers.length}`);
    
    if (finalAdminUsers.length > 0) {
      console.log('Admin credentials:');
      console.log(`Email: ${finalAdminUsers[0].email}`);
      console.log(`Password: Admin123!`);
    }

  } catch (error) {
    console.error('Error cleaning up admin users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupAdminUsers(); 