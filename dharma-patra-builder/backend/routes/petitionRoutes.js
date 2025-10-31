
const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const router = express.Router();
const logger = require('../utils/logger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/petitions');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created directory: ${uploadsDir}`);
}

/**
 * @route POST /api/petitions/generate
 * @desc Generate a PDF petition from form data
 * @access Public
 */
router.post('/generate', async (req, res) => {
  try {
    logger.info('Received petition form data for PDF generation');
    
    // Mock response for now - in reality, you'd generate a PDF here
    const fileId = `petition-${Date.now()}.pdf`;
    
    // Mock writing a file for demonstration purposes
    fs.writeFileSync(
      path.join(uploadsDir, fileId),
      'This is a mock PDF file content'
    );
    
    // Return success response with file ID
    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      fileId: fileId
    });
  } catch (error) {
    logger.error('Error generating petition PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
});

/**
 * @route POST /api/petitions/generate-pdf
 * @desc Generate and directly download a PDF petition
 * @access Public
 */
router.post('/generate-pdf', (req, res) => {
  try {
    logger.info('Generating PDF for direct download');
    const formData = req.body;
    
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Legal Petition',
        Author: 'AskLegal.io',
        Subject: formData.subject || 'Petition Document',
      }
    });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="petition-${Date.now()}.pdf"`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);
    
    // Add content to the PDF based on form data
    doc.fontSize(12);
    
    // Right-aligned text
    doc.fontSize(10).text('फाराम नं २', { align: 'right' });
    doc.moveDown();
    
    // Center-aligned headers
    doc.fontSize(16).font('Helvetica-Bold').text('श्री सर्वोच्च अदालत, काठमाडौंमा पेश गरेको', { align: 'center' });
    doc.fontSize(14).text('निवेदन पत्र', { align: 'center' });
    doc.moveDown();
    
    // Subject
    doc.fontSize(12).font('Helvetica').text(`विषय: ${formData.subject || '___________'}`);
    doc.moveDown();
    
    // Create a two-column layout for petitioner and opponent
    const startY = doc.y;
    
    // Left column - Petitioner
    doc.text(`मुद्दा नं ${formData.caseNumber || '___________'}`);
    doc.text(`को ठाउँ: ${formData.district || '___________'}`);
    doc.moveDown(0.5);
    doc.text('निवेदक');
    doc.text(`जिल्ला ${formData.applicantDistrictName || '___________'} न.पा./गा.पा. वडा नं. ${formData.applicantWardNumber || '___________'}`);
    doc.text(`बस्ने वर्ष ${formData.residentYears || '___'} को ${formData.applicantName || '___________'}`);
    
    // Save position after left column
    const leftColumnHeight = doc.y - startY;
    
    // Reset position to start a right column
    doc.moveTo(doc.page.width / 2, startY);
    doc.x = doc.page.width / 2;
    doc.y = startY;
    
    // Right column - Opponent
    doc.text('विरुद्ध');
    doc.moveDown(0.5);
    doc.text(`जिल्ला ${formData.opponentDistrictName || '___________'} न.पा./गा.पा. वडा नं. ${formData.opponentWardNumber || '___________'}`);
    doc.text(`बस्ने वर्ष ${formData.opponentYearsOfResidence || '___'} को ${formData.opponentName || '___________'}`);
    
    // Move to the position after both columns
    doc.x = 50; // Reset x to left margin
    doc.y = startY + Math.max(leftColumnHeight, doc.y - startY) + 20; // Move below the tallest column
    
    // Main content
    doc.font('Helvetica-Bold').text('मुद्दा:', { continued: false });
    doc.moveDown(0.5);
    doc.font('Helvetica').text('निवेदनपत्रको व्यहोरा देहाय अनुसार निवेदन गर्दछु/गर्दछौँ :', { indent: 20 });
    doc.moveDown();
    
    // Petition details with numbering
    doc.text('1. ' + (formData.petitionDetails || 'उक्त मुद्दामा मैले/हामीले जिल्ला न.पा./गा.पा. वडा नं बस्ने लाई तारिख तोकिएकोमा म/हामी अशक्त तारिखमा हाजिर हुन सकेको छैन। तसर्थ तारिख थामी पाउँ भनी कानून बमोजिम आफ्नो मुद्दाको तारिख थामी पाउँ।'), 
      { width: doc.page.width - 100, indent: 20 });
    doc.moveDown();
    
    doc.text('2. ' + (formData.demands || 'लेखिएको व्यहोरा ठिक साँचो हो फरक ठहरे कानूनबमोजिम सहुँला बुझाउँला।'), 
      { width: doc.page.width - 100, indent: 20 });
    doc.moveDown(2);
    
    // Footer - signature section
    const signatureY = doc.y;
    doc.x = doc.page.width - 200;
    doc.text('निवेदक', { align: 'left' });
    doc.text(`नाम: ${formData.applicantName || '___________'}`, { align: 'left' });
    doc.text(`मिति: ${formData.dateBS || formData.date || '___________'}`, { align: 'left' });
    
    // Move to the bottom for notes
    doc.x = 50;
    doc.y = doc.page.height - 100;
    
    // Notes section
    doc.fontSize(8).text('नोट : (१) यो निवेदनपत्र तथा कागजातहरूको प्रतिलिपीहरू सम्बन्धित पक्षलाई सम्बन्धित स्थानमा उपलब्ध गराउनुपर्ने छ र त्यसको प्रति अलग्गै प्रमाणित गरी अदालत/कार्यालयमा पेशिएको हुनुपर्नेछ।', 
      { width: doc.page.width - 100, color: 'gray' });
    doc.text('(२) अनुमति पाएमा मात्र निवेदनमात्र दिन सक्नेछ।', 
      { width: doc.page.width - 100, color: 'gray' });
    
    // Finalize the PDF
    doc.end();
    
    logger.info('PDF generated and download initiated');
  } catch (error) {
    logger.error('Error generating PDF for direct download:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate PDF for download',
      error: error.message
    });
  }
});

/**
 * @route GET /api/petitions/download/:fileId
 * @desc Download a generated petition PDF
 * @access Public
 */
router.get('/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(uploadsDir, fileId);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${fileId}`);
    
    // Stream the file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    logger.error('Error downloading petition PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to download PDF',
      error: error.message
    });
  }
});

module.exports = router;
