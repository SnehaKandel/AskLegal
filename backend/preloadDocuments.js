const Document = require('./models/Document');
const pdfProcessor = require('./services/pdfProcessor');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./utils/logger');

// Sample documents to preload
const sampleDocuments = [
  {
    title: 'Nepal Civil Code - Marriage and Divorce',
    filename: 'marriage-divorce-laws.pdf',
    category: 'Family Law',
    tags: ['marriage', 'divorce', 'civil code', 'family'],
    isPublic: true,
    accessLevel: 'public'
  },
  {
    title: 'Nepal Civil Code - Family Law',
    filename: 'family-laws.pdf',
    category: 'Family Law',
    tags: ['family', 'civil code', 'domestic relations'],
    isPublic: true,
    accessLevel: 'public'
  },
  {
    title: 'Nepal Civil Code - Criminal Law',
    filename: 'criminal-laws.pdf',
    category: 'Criminal Law',
    tags: ['criminal', 'penal code', 'offenses'],
    isPublic: true,
    accessLevel: 'public'
  },
  {
    title: 'Business Registration Act',
    filename: 'business-registration.pdf',
    category: 'Business Law',
    tags: ['business', 'registration', 'companies'],
    isPublic: true,
    accessLevel: 'public'
  },
  {
    title: 'Land Act of Nepal',
    filename: 'land-acts.pdf',
    category: 'Property Law',
    tags: ['land', 'property', 'real estate'],
    isPublic: true,
    accessLevel: 'public'
  }
];

async function preloadDocuments() {
  try {
    console.log('📚 Preloading Sample Documents\n');

    // Check if documents already exist
    const existingDocs = await Document.find({});
    if (existingDocs.length > 0) {
      console.log(`Found ${existingDocs.length} existing documents. Skipping preload.`);
      return;
    }

    console.log('No existing documents found. Preloading sample documents...\n');

    for (const docInfo of sampleDocuments) {
      try {
        // Check if sample PDF exists
        const samplePath = path.join(__dirname, 'sample-documents', docInfo.filename);
        const exists = await fs.access(samplePath).then(() => true).catch(() => false);
        
        if (!exists) {
          console.log(`⚠️  Sample file not found: ${docInfo.filename}`);
          continue;
        }

        // Copy to uploads directory
        const uploadsDir = path.join(__dirname, 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        
        const newFilename = `${uuidv4()}-${docInfo.filename}`;
        const uploadPath = path.join(uploadsDir, newFilename);
        
        await fs.copyFile(samplePath, uploadPath);
        
        // Get file stats
        const stats = await fs.stat(uploadPath);

        // Create document record
        const document = new Document({
          title: docInfo.title,
          filename: newFilename,
          originalName: docInfo.filename,
          filePath: uploadPath,
          fileSize: stats.size,
          uploadedBy: 'system', // Special system user
          status: 'processing',
          metadata: {
            category: docInfo.category,
            tags: docInfo.tags
          },
          isPublic: docInfo.isPublic,
          accessLevel: docInfo.accessLevel
        });

        await document.save();
        console.log(`✅ Created document: ${docInfo.title}`);

        // Process PDF in background
        pdfProcessor.processPDF(document._id, uploadPath, document.title)
          .then(async (result) => {
            try {
              document.status = 'processed';
              document.totalChunks = result.totalChunks;
              document.processedChunks = result.processedChunks;
              document.metadata.pages = result.pages;
              document.metadata.textLength = result.textLength;
              await document.save();
              
              console.log(`✅ Processed: ${docInfo.title}`);
            } catch (saveError) {
              console.error(`❌ Error saving processed document ${docInfo.title}:`, saveError.message);
            }
          })
          .catch(async (error) => {
            try {
              document.status = 'error';
              document.processingError = error.message;
              await document.save();
              
              console.error(`❌ Error processing ${docInfo.title}:`, error.message);
            } catch (saveError) {
              console.error(`❌ Error saving error status for ${docInfo.title}:`, saveError.message);
            }
          });

      } catch (error) {
        console.error(`❌ Error preloading ${docInfo.title}:`, error.message);
      }
    }

    console.log('\n🎉 Document preload completed!');
    console.log('Documents will be processed in the background.');
    console.log('Check processing status with: node checkProcessing.js');

  } catch (error) {
    console.error('❌ Preload failed:', error.message);
  }
}

// Run preload
preloadDocuments(); 