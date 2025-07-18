require('dotenv').config();

console.log('Testing environment variables...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI is not set!');
  console.log('Current working directory:', process.cwd());
  console.log('Files in current directory:');
  const fs = require('fs');
  fs.readdirSync('.').forEach(file => {
    console.log('  -', file);
  });
} else {
  console.log('✅ MONGODB_URI is set correctly');
} 