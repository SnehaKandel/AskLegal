const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Since we don't have a PDF library installed, let's create a simple solution
// that creates files that will work with our system

function createPDFfromText(text, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.font('Times-Roman').fontSize(12).text(text, {
      width: 410,
      align: 'left',
    });
    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function createTestPDFs() {
  console.log('📄 Creating real PDF files for upload...\n');

  const sampleDir = path.join(__dirname, 'sample-documents');
  const pdfDir = path.join(__dirname, 'real-pdfs');

  // Create PDF directory if it doesn't exist
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
    console.log('✅ Created real-pdfs directory');
  }

  // Read all text files and create real PDF files
  const textFiles = fs.readdirSync(sampleDir).filter(file => file.endsWith('.txt'));

  for (const file of textFiles) {
    const textPath = path.join(sampleDir, file);
    const pdfPath = path.join(pdfDir, file.replace('.txt', '.pdf'));
    const content = fs.readFileSync(textPath, 'utf8');
    await createPDFfromText(content, pdfPath);
    console.log(`✅ Created: ${file.replace('.txt', '.pdf')}`);
  }

  console.log(`\n📁 Real PDF files created in: ${pdfDir}`);
  console.log('\n📋 Files ready for upload:');
  fs.readdirSync(pdfDir).forEach(file => {
    const filePath = path.join(pdfDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });

  console.log('\n🎯 Instructions:');
  console.log('1. These are real PDF files for development/testing purposes');
  console.log('2. For production, use actual legal PDF documents');
  console.log('3. Upload these files through the admin interface');
  console.log('4. The system will process them and create embeddings');
  console.log('5. Test the chatbot with questions about the content');
}

// Run the conversion
createTestPDFs(); 