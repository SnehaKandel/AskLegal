
import api from "@/lib/api";

/**
 * Service for handling PDF-related operations
 */
export const pdfService = {
  /**
   * Opens a petition PDF in a new tab
   * @param fileId - The ID or filename of the PDF to open
   */
  openPetitionPdf: (fileId: string): void => {
    // Updated path to use /api/petitions/download/:fileId
    const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/petitions/download/${fileId}`;
    
    console.log("Opening PDF URL:", pdfUrl);
    
    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');
  },

  /**
   * Submits petition form data and returns the generated PDF file ID
   * @param formData - The petition form data
   * @returns Promise resolving to the file ID of the generated PDF
   */
  submitPetitionForm: async (formData: any): Promise<string> => {
    try {
      // Log the form data being sent
      console.log('Sending petition form data to backend');
      
      // Updated to use the correct API path
      console.log('Target endpoint:', '/api/petitions/generate');
      
      // Make the API call to generate the PDF with the correct path
      const response = await api.post('/api/petitions/generate', formData);
      
      console.log('PDF generation response:', response.data);
      
      // Return the file ID from the response
      return response.data.fileId || 'temp-file-id';
    } catch (error: any) {
      console.error('Error generating petition PDF:', error);
      
      // Check if server is running
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to the backend server. Please check if the server is running at http://localhost:5000.');
      }
      
      // Show detailed error information for debugging
      if (error.response?.status === 404) {
        throw new Error(`API endpoint not found (404). To fix this issue, make sure petitionRoutes.js is created and registered in app.js.`);
      } else if (error.response?.data?.error) {
        throw new Error(`Server error: ${error.response.data.error}`);
      } 
      
      throw error;
    }
  },

  /**
   * Downloads the petition form directly as a PDF without storing it first
   * @param formData - The petition form data
   */
  downloadPetitionPdf: async (formData: any): Promise<void> => {
    try {
      console.log('Requesting PDF download with form data');
      
      // Make the API call to generate and download the PDF
      const response = await api.post('/api/petitions/generate-pdf', formData, {
        responseType: 'blob', // Important: We want the response as a Blob
      });
      
      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `petition-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append to the document, click, and then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download initiated successfully');
    } catch (error: any) {
      console.error('Error downloading petition PDF:', error);
      
      // Detailed error handling
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to the backend server. Please check if the server is running.');
      } else if (error.response?.status === 404) {
        throw new Error('PDF generation endpoint not found. Check backend routes configuration.');
      } else {
        throw new Error(`Failed to download PDF: ${error.message || 'Unknown error'}`);
      }
    }
  }
};
