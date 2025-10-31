
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const ragService = {
  async uploadPDFs(files: FileList) {
    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
      }
      
      const response = await api.post('/rag/upload-pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({
        title: 'Success',
        description: `Processed ${response.data.documentsCount} document chunks from ${response.data.filesProcessed} PDFs`,
      });
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to upload PDFs';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  },

  async queryRAG(question: string) {
    try {
      const response = await api.post('/rag/query', { question });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to get answer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  },

  async getStatus() {
    try {
      const response = await api.get('/rag/status');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get RAG status:', error);
      return { documentsCount: 0, filesUploaded: 0, files: [] };
    }
  }
};
