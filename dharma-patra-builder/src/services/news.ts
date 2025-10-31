import api from '@/lib/api';

export interface NewsArticle {
  _id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  success: boolean;
  fromCache?: boolean;
  count: number;
  total?: number;
  page?: number;
  pages?: number;
  news: NewsArticle[];
  scheduler?: {
    isRunning: boolean;
    lastRun: string | null;
    updateInterval: number;
    nextRun: string | null;
  };
}

export interface LatestNewsResponse {
  success: boolean;
  fromCache?: boolean;
  count: number;
  news: NewsArticle[];
}

export interface SchedulerStatus {
  isRunning: boolean;
  lastRun: string | null;
  updateInterval: number;
  nextRun: string | null;
}

export const newsService = {
  // Get all news with pagination and filters
  async getNews(params: {
    page?: number;
    limit?: number;
    language?: string;
    source?: string;
  } = {}): Promise<NewsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.language) searchParams.append('language', params.language);
    if (params.source) searchParams.append('source', params.source);

    const response = await api.get(`/api/news?${searchParams.toString()}`);
    return response.data;
  },

  // Get latest news for homepage
  async getLatestNews(limit: number = 10): Promise<LatestNewsResponse> {
    const response = await api.get(`/api/news/latest?limit=${limit}`);
    return response.data;
  },

  // Get available news sources
  async getNewsSources(): Promise<{ success: boolean; sources: string[] }> {
    const response = await api.get('/api/news/sources');
    return response.data;
  },

  // Get scheduler status
  async getSchedulerStatus(): Promise<{ success: boolean; status: SchedulerStatus }> {
    const response = await api.get('/api/news/status');
    return response.data;
  },

  // Admin functions
  async refreshNews(): Promise<{ success: boolean; added: number; articles: NewsArticle[] }> {
    const response = await api.post('/api/news/refresh');
    return response.data;
  },

  async startScheduler(): Promise<{ success: boolean; message: string; status: SchedulerStatus }> {
    const response = await api.post('/api/news/start-scheduler');
    return response.data;
  },

  async stopScheduler(): Promise<{ success: boolean; message: string; status: SchedulerStatus }> {
    const response = await api.post('/api/news/stop-scheduler');
    return response.data;
  },

  async triggerScraping(): Promise<{ success: boolean; message: string; status: SchedulerStatus }> {
    const response = await api.post('/api/news/trigger-scraping');
    return response.data;
  },

  // Test scraping
  async testScrape(): Promise<{ success: boolean; count: number; sample: NewsArticle[] }> {
    const response = await api.get('/api/news/test-scrape');
    return response.data;
  },

  // Helper function to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  },

  // Helper function to get source color
  getSourceColor(source: string): string {
    const colors: { [key: string]: string } = {
      'The Himalayan Times': 'bg-blue-100 text-blue-800',
      'Kathmandu Post': 'bg-green-100 text-green-800',
      'Online Khabar': 'bg-purple-100 text-purple-800',
      'Nepal News': 'bg-orange-100 text-orange-800'
    };
    
    return colors[source] || 'bg-gray-100 text-gray-800';
  }
};
