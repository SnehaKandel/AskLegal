const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asklegal');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

// Create a new user
const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    console.log('✅ User created successfully:');
    console.log(`ID: ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    return null;
  }
};

// List all users
const listUsers = async () => {
  try {
    const users = await User.find({}).select('-password -refreshToken');
    console.log('\n📋 All Users:');
    console.log('─'.repeat(80));
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Status: ${user.status} | Created: ${user.createdAt.toDateString()}`);
      console.log('');
    });
    return users;
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
    return [];
  }
};

// Update user role
const updateUserRole = async (email, newRole) => {
  try {
    if (!['user', 'admin'].includes(newRole)) {
      console.error('❌ Invalid role. Must be "user" or "admin"');
      return null;
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: newRole },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      console.error('❌ User not found');
      return null;
    }

    console.log('✅ User role updated successfully:');
    console.log(`Email: ${user.email}`);
    console.log(`New Role: ${user.role}`);
    return user;
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    return null;
  }
};

// Update user status
const updateUserStatus = async (email, newStatus) => {
  try {
    if (!['active', 'inactive'].includes(newStatus)) {
      console.error('❌ Invalid status. Must be "active" or "inactive"');
      return null;
    }

    const user = await User.findOneAndUpdate(
      { email },
      { status: newStatus },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      console.error('❌ User not found');
      return null;
    }

    console.log('✅ User status updated successfully:');
    console.log(`Email: ${user.email}`);
    console.log(`New Status: ${user.status}`);
    return user;
  } catch (error) {
    console.error('❌ Error updating user status:', error.message);
    return null;
  }
};

// Delete user
const deleteUser = async (email) => {
  try {
    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      console.error('❌ User not found');
      return false;
    }

    console.log('✅ User deleted successfully:');
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
    return false;
  }
};

// Main function to handle command line arguments
const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create':
      if (args.length < 4) {
        console.log('Usage: node manageUsers.js create <name> <email> <password> [role]');
        console.log('Example: node manageUsers.js create "John Doe" "john@example.com" "password123" admin');
        break;
      }
      await createUser({
        name: args[1],
        email: args[2],
        password: args[3],
        role: args[4] || 'user'
      });
      break;

    case 'list':
      await listUsers();
      break;

    case 'update-role':
      if (args.length < 3) {
        console.log('Usage: node manageUsers.js update-role <email> <role>');
        console.log('Example: node manageUsers.js update-role "john@example.com" admin');
        break;
      }
      await updateUserRole(args[1], args[2]);
      break;

    case 'update-status':
      if (args.length < 3) {
        console.log('Usage: node manageUsers.js update-status <email> <status>');
        console.log('Example: node manageUsers.js update-status "john@example.com" inactive');
        break;
      }
      await updateUserStatus(args[1], args[2]);
      break;

    case 'delete':
      if (args.length < 2) {
        console.log('Usage: node manageUsers.js delete <email>');
        console.log('Example: node manageUsers.js delete "john@example.com"');
        break;
      }
      await deleteUser(args[1]);
      break;

    default:
      console.log('🔧 User Management Tool');
      console.log('─'.repeat(50));
      console.log('Available commands:');
      console.log('  create <name> <email> <password> [role]  - Create a new user');
      console.log('  list                                    - List all users');
      console.log('  update-role <email> <role>              - Update user role (user/admin)');
      console.log('  update-status <email> <status>          - Update user status (active/inactive)');
      console.log('  delete <email>                          - Delete a user');
      console.log('');
      console.log('Examples:');
      console.log('  node manageUsers.js create "John Doe" "john@example.com" "password123" admin');
      console.log('  node manageUsers.js list');
      console.log('  node manageUsers.js update-role "john@example.com" admin');
      console.log('  node manageUsers.js update-status "john@example.com" inactive');
      console.log('  node manageUsers.js delete "john@example.com"');
  }

  await disconnectDB();
};

// Run the script
main().catch(console.error); 