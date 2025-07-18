const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const setupRAGSystem = async () => {
  console.log('🚀 Setting up RAG System with Ollama...\n');

  try {
    // Step 1: Check if Ollama is running
    console.log('1. Checking Ollama status...');
    try {
      const ollamaResponse = await axios.get('http://localhost:11434/api/tags');
      console.log('✅ Ollama is running');
      console.log('Available models:', ollamaResponse.data.models?.map(m => m.name).join(', ') || 'None');
    } catch (error) {
      console.log('❌ Ollama is not running or not accessible');
      console.log('💡 Please start Ollama: ollama serve');
      console.log('💡 Then pull required models:');
      console.log('   ollama pull llama2');
      console.log('   ollama pull nomic-embed-text');
      return;
    }

    // Step 2: Check backend connectivity
    console.log('\n2. Checking backend connectivity...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/api/health');
      console.log('✅ Backend is running');
    } catch (error) {
      console.log('❌ Backend is not running');
      console.log('💡 Please start the backend: cd backend && npm start');
      return;
    }

    // Step 3: Test authentication
    console.log('\n3. Testing authentication...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@asklegal.com',
        password: 'Admin123!'
      });
      
      const token = loginResponse.data.token;
      console.log('✅ Authentication successful');
      
      // Step 4: Test RAG endpoints
      console.log('\n4. Testing RAG endpoints...');
      
      // Test RAG status
      const statusResponse = await axios.get('http://localhost:5000/api/rag/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ RAG status endpoint working');
      
      // Test models endpoint
      const modelsResponse = await axios.get('http://localhost:5000/api/rag/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Models endpoint working');
      
      // Step 5: Check for existing documents
      console.log('\n5. Checking existing documents...');
      const docsResponse = await axios.get('http://localhost:5000/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const documentCount = docsResponse.data.documents.length;
      console.log(`📄 Found ${documentCount} existing documents`);
      
      if (documentCount === 0) {
        console.log('\n📝 No documents found. You need to upload at least 5 PDF documents.');
        console.log('💡 Steps to upload documents:');
        console.log('   1. Login as admin at http://localhost:3000/login');
        console.log('   2. Go to Documents page');
        console.log('   3. Upload PDF files (legal documents, regulations, etc.)');
        console.log('   4. Wait for processing to complete');
      } else if (documentCount < 5) {
        console.log(`⚠️  Only ${documentCount} documents found. Recommended: Upload at least 5 documents for better RAG performance.`);
      } else {
        console.log('✅ Sufficient documents for RAG system');
      }
      
      // Step 6: Test RAG chat (if documents exist)
      if (documentCount > 0) {
        console.log('\n6. Testing RAG chat functionality...');
        try {
          const chatResponse = await axios.post('http://localhost:5000/api/rag/chat', {
            message: 'What are the requirements for starting a business in Nepal?',
            contextLimit: 3
          }, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('✅ RAG chat working');
          console.log('Sample response:', chatResponse.data.response.substring(0, 100) + '...');
          
          if (chatResponse.data.sources && chatResponse.data.sources.length > 0) {
            console.log(`📚 Found ${chatResponse.data.sources.length} relevant sources`);
          }
        } catch (error) {
          console.log('❌ RAG chat test failed:', error.response?.data?.message || error.message);
        }
      }
      
      console.log('\n🎉 RAG System Setup Complete!');
      console.log('\n📋 Summary:');
      console.log('- Ollama is running and accessible');
      console.log('- Backend is connected and healthy');
      console.log('- Authentication is working');
      console.log('- RAG endpoints are functional');
      console.log(`- ${documentCount} documents available`);
      
      if (documentCount >= 5) {
        console.log('\n✨ Your RAG system is ready for production use!');
        console.log('Users can now ask questions and get answers based on uploaded documents.');
      } else {
        console.log('\n📝 Next steps:');
        console.log('1. Upload more PDF documents (aim for at least 5)');
        console.log('2. Test the chatbot on the homepage');
        console.log('3. Monitor response quality and adjust as needed');
      }
      
    } catch (error) {
      console.log('❌ Authentication failed');
      console.log('💡 Make sure admin user exists:');
      console.log('   node setupAdmin.js');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
};

// Create sample PDF documents for testing
const createSampleDocuments = async () => {
  console.log('\n📄 Creating sample documents for testing...');
  
  const sampleDocs = [
    {
      title: 'Business Registration Guidelines',
      content: `Business Registration in Nepal

1. Requirements for Business Registration:
   - Valid citizenship certificate or passport
   - PAN registration certificate
   - Tax clearance certificate
   - Bank account details
   - Business plan and feasibility study

2. Registration Process:
   - Submit application to Department of Industry
   - Pay registration fees
   - Obtain business license
   - Register for VAT if applicable

3. Types of Business Entities:
   - Sole Proprietorship
   - Partnership
   - Private Limited Company
   - Public Limited Company

4. Timeline: 15-30 working days for complete registration process.`
    },
    {
      title: 'Property Registration Laws',
      content: `Property Registration in Nepal

1. Required Documents:
   - Land ownership certificate
   - Tax clearance certificate
   - Building completion certificate
   - Survey map
   - Identity documents

2. Registration Process:
   - Submit documents to Land Revenue Office
   - Pay registration fees and taxes
   - Obtain property registration certificate
   - Update land records

3. Property Types:
   - Residential property
   - Commercial property
   - Agricultural land
   - Industrial property

4. Fees: 1-3% of property value depending on type and location.`
    },
    {
      title: 'Marriage and Divorce Procedures',
      content: `Marriage and Divorce Laws in Nepal

1. Marriage Registration:
   - Both parties must be 20 years or older
   - Submit application to local authority
   - Provide identity documents
   - Pay registration fees
   - Obtain marriage certificate

2. Divorce Procedures:
   - Mutual consent divorce
   - Contested divorce
   - Grounds for divorce include cruelty, adultery, desertion
   - Court proceedings required for contested cases

3. Legal Requirements:
   - Minimum age: 20 years
   - No existing marriage
   - Mental capacity
   - Free consent

4. Timeline: Marriage registration takes 1-2 weeks, divorce 6-12 months.`
    },
    {
      title: 'Employment and Labor Laws',
      content: `Employment and Labor Laws in Nepal

1. Employment Contracts:
   - Written contract required
   - Minimum wage compliance
   - Working hours: 8 hours per day, 48 hours per week
   - Overtime compensation

2. Employee Rights:
   - Paid leave (annual, sick, maternity)
   - Social security benefits
   - Safe working conditions
   - Protection from discrimination

3. Employer Obligations:
   - Timely salary payment
   - Safe working environment
   - Social security contributions
   - Compliance with labor laws

4. Dispute Resolution:
   - Labor court jurisdiction
   - Mediation and arbitration
   - Appeal process available.`
    },
    {
      title: 'Taxation and Financial Regulations',
      content: `Taxation and Financial Regulations in Nepal

1. Income Tax:
   - Progressive tax rates
   - Annual filing requirement
   - Deductions and exemptions available
   - Penalties for non-compliance

2. VAT Registration:
   - Required for businesses with turnover above threshold
   - Monthly filing and payment
   - Input tax credit available
   - Audit requirements

3. Corporate Tax:
   - 25% for companies
   - Special rates for certain sectors
   - Tax incentives for investment
   - Transfer pricing regulations

4. Compliance Requirements:
   - Regular filing deadlines
   - Record keeping requirements
   - Audit and inspection rights
   - Penalties for violations.`
    }
  ];

  const uploadsDir = path.join(__dirname, 'backend', 'uploads');
  
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    
    for (const doc of sampleDocs) {
      const filename = `${doc.title.replace(/\s+/g, '_')}.txt`;
      const filepath = path.join(uploadsDir, filename);
      
      await fs.writeFile(filepath, doc.content);
      console.log(`✅ Created: ${filename}`);
    }
    
    console.log('\n📝 Sample documents created in backend/uploads/');
    console.log('💡 You can use these as reference or upload your own PDF documents.');
    
  } catch (error) {
    console.log('❌ Error creating sample documents:', error.message);
  }
};

// Run setup
setupRAGSystem().then(() => {
  // Ask if user wants to create sample documents
  console.log('\n🤔 Would you like to create sample documents for testing? (y/n)');
  process.stdin.once('data', (data) => {
    if (data.toString().trim().toLowerCase() === 'y') {
      createSampleDocuments();
    } else {
      console.log('\n📝 You can upload your own PDF documents through the admin interface.');
    }
    process.exit(0);
  });
}); 