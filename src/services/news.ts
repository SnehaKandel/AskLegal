
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface NewsParams {
  page?: number;
  limit?: number;
  language?: string;
}

export const newsService = {
  async getNews(params: NewsParams = {}) {
    try {
      const response = await api.get('/news', { params });
      return response.data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch news',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async refreshNews() {
    try {
      const response = await api.post('/news/refresh');
      toast({
        title: 'News Updated',
        description: `${response.data.added} new articles added`,
      });
      return response.data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to refresh news',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
