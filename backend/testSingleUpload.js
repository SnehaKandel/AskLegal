const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BACKEND_URL = 'http://localhost:5000';

async function testSingleUpload() {
  try {
    console.log('🧪 Testing Single File Upload\n');

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

    // 2. Check if we have PDF files to upload
    console.log('\n2. Checking for PDF files...');
    const pdfDir = path.join(__dirname, 'real-pdfs');
    if (!fs.existsSync(pdfDir)) {
      console.log('❌ No PDF directory found. Run createRealPDFs.js first.');
      return;
    }

    const pdfFiles = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      console.log('❌ No PDF files found. Run createRealPDFs.js first.');
      return;
    }

    console.log(`✅ Found ${pdfFiles.length} PDF files`);

    // 3. Test single file upload
    console.log('\n3. Testing single file upload...');
    const formData = new FormData();
    
    const fileToUpload = pdfFiles[0];
    const filePath = path.join(pdfDir, fileToUpload);
    formData.append('pdf', fs.createReadStream(filePath));
    formData.append('title', 'Test Single Upload');
    formData.append('category', 'Legal Documents');
    formData.append('tags', 'test, legal, nepal, single-upload');
    formData.append('isPublic', 'true');
    formData.append('accessLevel', 'public');

    try {
      const uploadResponse = await axios.post(`${BACKEND_URL}/api/documents/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('✅ Single file upload successful!');
      console.log(`   Message: ${uploadResponse.data.message}`);
      console.log(`   Document ID: ${uploadResponse.data.document.id}`);
      
    } catch (error) {
      console.log('❌ Single file upload failed:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    }

    console.log('\n🎉 Single file upload test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSingleUpload(); 