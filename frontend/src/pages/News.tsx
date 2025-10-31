import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsService } from '@/services/news';

interface NewsItem {
  id: string;
  _id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(new Date());
  const { toast } = useToast();

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing news');
      fetchNews();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Function to fetch news from API
  const fetchNews = async () => {
    setLoading(true);
    
    try {
      const response = await newsService.getNews({ 
        limit: 10,
        language: 'ne'  // For Nepali news
      });
      
      // Map backend news data to match frontend format
      const mappedNews = response.news.map((item: any) => ({
        id: item._id,
        _id: item._id,
        title: item.title,
        source: item.source,
        url: item.url,
        publishedAt: item.publishedAt,
        summary: item.summary,
      }));
      
      setNews(mappedNews);
      setLastFetched(new Date());
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    
    try {
      // For admin users, try to scrape new content
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
      
      if (user?.role === 'admin') {
        await newsService.refreshNews();
      }
      
      // Fetch the latest news
      await fetchNews();
      
      toast({
        title: "समाचार अद्यावधिक",
        description: "नयाँ समाचारहरू प्राप्त गरिएको छ।",
      });
    } catch (error) {
      console.error('News refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-asklegal-purple">ताजा समाचार</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">
              अन्तिम अद्यावधिक: {lastFetched.toLocaleTimeString()}
            </span>
            <Button 
              onClick={handleRefresh} 
              disabled={loading} 
              variant="outline" 
              className="bg-transparent border-asklegal-purple/50 text-white hover:bg-asklegal-purple/10 flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              रिलोड गर्नुहोस्
            </Button>
          </div>
        </div>

        {loading && news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/70">Loading news...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.length > 0 ? news.map((item) => (
              <div key={item.id} className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium text-white">{item.title}</h3>
                  <span className="text-asklegal-purple text-sm">{item.source}</span>
                </div>
                <p className="text-white/70 mb-4">{item.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">
                    {new Date(item.publishedAt).toLocaleDateString('ne-NP')}
                  </span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-asklegal-purple hover:underline"
                  >
                    थप पढ्नुहोस्
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-white/70">No news articles found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default News;
