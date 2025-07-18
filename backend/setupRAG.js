const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const ADMIN_CREDENTIALS = {
  email: 'admin@asklegal.com',
  password: 'Admin123!'
};

async function loginAsAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, ADMIN_CREDENTIALS);
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function checkRAGStatus(token) {
  try {
    console.log('🔍 Checking RAG system status...');
    const response = await axios.get(`${BACKEND_URL}/api/rag/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ RAG Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ RAG status check failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testRAGChat(token) {
  try {
    console.log('🤖 Testing RAG chat...');
    const testQuestions = [
      "What are the requirements for starting a business in Nepal?",
      "What documents do I need for property registration?",
      "What are the legal procedures for divorce?",
      "How do I file a criminal complaint?",
      "What are the minimum wage requirements for employees?"
    ];

    for (const question of testQuestions) {
      console.log(`\n📝 Question: ${question}`);
      
      const response = await axios.post(`${BACKEND_URL}/api/rag/chat`, {
        message: question,
        contextLimit: 3
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(`🤖 Answer: ${response.data.response}`);
      
      if (response.data.sources && response.data.sources.length > 0) {
        console.log(`📚 Sources: ${response.data.sources.length} documents found`);
        response.data.sources.forEach((source, index) => {
          console.log(`   ${index + 1}. ${source.document} (${Math.round(source.similarity * 100)}% match)`);
        });
      } else {
        console.log('📚 No sources found');
      }
    }
  } catch (error) {
    console.error('❌ RAG chat test failed:', error.response?.data || error.message);
  }
}

async function checkDocuments(token) {
  try {
    console.log('📄 Checking uploaded documents...');
    const response = await axios.get(`${BACKEND_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`📊 Found ${response.data.documents.length} documents:`);
    response.data.documents.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.title} (${doc.status})`);
    });
    
    return response.data.documents;
  } catch (error) {
    console.error('❌ Document check failed:', error.response?.data || error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting RAG System Test...\n');
  
  try {
    // Step 1: Login as admin
    const token = await loginAsAdmin();
    console.log('✅ Admin login successful\n');
    
    // Step 2: Check RAG status
    await checkRAGStatus(token);
    console.log('');
    
    // Step 3: Check documents
    const documents = await checkDocuments(token);
    console.log('');
    
    // Step 4: Test RAG chat (only if documents are available)
    if (documents.length > 0) {
      await testRAGChat(token);
    } else {
      console.log('⚠️  No documents found. Please upload some PDFs first.');
      console.log('📋 Instructions:');
      console.log('   1. Go to /documents page as admin');
      console.log('   2. Upload the sample PDFs from backend/sample-documents/');
      console.log('   3. Wait for processing to complete');
      console.log('   4. Run this script again');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running on port 5000');
    console.log('   2. Make sure Ollama is running (ollama serve)');
    console.log('   3. Make sure admin user exists');
    console.log('   4. Check network connectivity');
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main }; 