const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BACKEND_URL = 'http://localhost:5000';

async function testMultiUpload() {
  try {
    console.log('🧪 Testing Multi-File Upload Functionality\n');

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
    pdfFiles.forEach((file, index) => {
      const filePath = path.join(pdfDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${index + 1}. ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    });

    // 3. Test multi-file upload
    console.log('\n3. Testing multi-file upload...');
    const formData = new FormData();
    
    // Add up to 5 PDF files
    const filesToUpload = pdfFiles.slice(0, 5);
    filesToUpload.forEach(file => {
      const filePath = path.join(pdfDir, file);
      formData.append('pdfs', fs.createReadStream(filePath));
    });
    
    formData.append('category', 'Legal Documents');
    formData.append('tags', 'test, legal, nepal, multi-upload');
    formData.append('isPublic', 'true');
    formData.append('accessLevel', 'public');

    try {
      const uploadResponse = await axios.post(`${BACKEND_URL}/api/documents/upload-multiple`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('✅ Multi-file upload successful!');
      console.log(`   Message: ${uploadResponse.data.message}`);
      console.log(`   Summary: ${uploadResponse.data.summary.total} total, ${uploadResponse.data.summary.successful} successful, ${uploadResponse.data.summary.failed} failed`);
      
      console.log('\n📋 Upload Results:');
      uploadResponse.data.results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} ${result.filename}: ${result.message}`);
      });
      
    } catch (error) {
      console.log('❌ Multi-file upload failed:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // 4. Check documents after upload
    console.log('\n4. Checking documents after upload...');
    try {
      const docsResponse = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const documents = docsResponse.data.documents;
      console.log(`✅ Found ${documents.length} total documents`);
      
      const recentDocs = documents.slice(0, 5);
      console.log('\n📄 Recent documents:');
      recentDocs.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.title} (${doc.status})`);
      });
      
    } catch (error) {
      console.log('❌ Failed to fetch documents:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Multi-file upload test completed!');
    console.log('\nNext steps:');
    console.log('1. Check the admin interface to see uploaded documents');
    console.log('2. Monitor document processing status');
    console.log('3. Test the chatbot with questions about uploaded content');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMultiUpload(); 