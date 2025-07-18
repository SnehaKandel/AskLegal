const fs = require('fs');
const path = require('path');

// Simple script to create PDF-like files for testing
// In a real scenario, you would use a proper PDF library like pdfkit

function createTestPDFs() {
  console.log('📄 Creating test PDF files for upload...\n');

  const sampleDir = path.join(__dirname, 'sample-documents');
  const pdfDir = path.join(__dirname, 'test-pdfs');

  // Create PDF directory if it doesn't exist
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
    console.log('✅ Created test-pdfs directory');
  }

  // Read all text files and create PDF-like files
  const textFiles = fs.readdirSync(sampleDir).filter(file => file.endsWith('.txt'));

  textFiles.forEach(file => {
    const textPath = path.join(sampleDir, file);
    const pdfPath = path.join(pdfDir, file.replace('.txt', '.pdf'));
    
    // Read the text content
    const content = fs.readFileSync(textPath, 'utf8');
    
    // Create a simple PDF-like file (in real scenario, use proper PDF library)
    // For testing purposes, we'll create a file with .pdf extension
    // that contains the text content
    fs.writeFileSync(pdfPath, content);
    
    console.log(`✅ Created: ${file.replace('.txt', '.pdf')}`);
  });

  console.log(`\n📁 Test PDF files created in: ${pdfDir}`);
  console.log('\n📋 Files ready for upload:');
  fs.readdirSync(pdfDir).forEach(file => {
    const filePath = path.join(pdfDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });

  console.log('\n🎯 Instructions:');
  console.log('1. These are test files for development purposes');
  console.log('2. For production, use actual PDF documents');
  console.log('3. Upload these files through the admin interface');
  console.log('4. The system will process them and create embeddings');
  console.log('5. Test the chatbot with questions about the content');

  console.log('\n⚠️ Note: These are not real PDFs but text files with .pdf extension');
  console.log('   For proper testing, convert actual documents to PDF format.');
}

// Run the conversion
createTestPDFs(); 