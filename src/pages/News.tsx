import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsService } from '@/services/news';
import { Card, CardContent } from '@/components/ui/card';

interface NewsItem {
  id: string;
  _id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  imageUrl?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(new Date());
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Function to fetch news from API
  const fetchNews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    
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
        imageUrl: item.imageUrl,
      }));
      
      // Check for new items
      if (news.length > 0) {
        const newItems = mappedNews.filter(
          newItem => !news.some(oldItem => oldItem.id === newItem.id)
        );
        
        if (newItems.length > 0 && silent) {
          setNewItemsCount(newItems.length);
          toast({
            title: `${newItems.length} new news`,
            description: "New updates available",
          });
        }
      }
      
      setNews(mappedNews);
      setLastFetched(new Date());
      // Reset image load errors when new data is fetched
      setImageLoadErrors(new Set());
    } catch (error) {
      console.error('Failed to fetch news:', error);
      if (!silent) {
        toast({
          title: "Failed to load news",
          description: "Please try again later",
          variant: "destructive",
        });
      }
      // Keep showing existing news as fallback
    } finally {
      if (!silent) setLoading(false);
    }
  }, [news, toast]);

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing news');
      fetchNews(true); // silent refresh
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchNews]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    setNewItemsCount(0);
    
    try {
      // For admin users, try to scrape new content
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
      
      if (user?.role === 'admin') {
        await newsService.refreshNews();
      }
      
      // Fetch the latest news
      await fetchNews();
      
      toast({
        title: "Latest news",
        description: "New updates available",
      });
    } catch (error) {
      console.error('News refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking "Read More"
  const handleReadMore = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle image load error
  const handleImageError = (itemId: string) => {
    setImageLoadErrors(prev => new Set([...prev, itemId]));
  };

  // Enhanced image loading with quality optimization
  const ImageWithFallback = ({ item }: { item: NewsItem }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    if (!item.imageUrl || imageLoadErrors.has(item.id) || imageError) {
      return null;
    }

    return (
      <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full"></div>
          </div>
        )}
        <img 
          src={item.imageUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            imageRendering: 'auto',
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            handleImageError(item.id);
          }}
          crossOrigin="anonymous"
        />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-asklegal-purple">News</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-asklegal-text/60 theme-transition">
              Last updated: {lastFetched.toLocaleTimeString()}
            </span>
            {newItemsCount > 0 && (
              <span className="bg-asklegal-purple text-white px-2 py-1 rounded-full text-xs animate-pulse">
                +{newItemsCount} new
              </span>
            )}
            <Button 
              onClick={handleRefresh} 
              disabled={loading} 
              variant="outline" 
              className="bg-transparent border-asklegal-purple/50 text-asklegal-text hover:bg-asklegal-purple/10 flex items-center gap-2 theme-transition"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Reload
            </Button>
          </div>
        </div>

        {loading && news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-asklegal-text/70 theme-transition">News feed is loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.length > 0 ? news.map((item) => (
              <Card key={item.id} className="card-glassmorphism overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <ImageWithFallback item={item} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium text-asklegal-heading theme-transition">{item.title}</h3>
                      <span className="text-asklegal-purple text-sm">{item.source}</span>
                    </div>
                    <p className="text-asklegal-text/70 mb-4 theme-transition line-clamp-2">{item.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-asklegal-text/50 text-sm theme-transition">
                        {new Date(item.publishedAt).toLocaleDateString('ne-NP')}
                      </span>
                      <Button 
                        variant="link" 
                        className="text-asklegal-purple hover:text-asklegal-purple/80 p-0 flex items-center gap-1"
                        onClick={() => handleReadMore(item.url)}
                      >
                        Read more <ExternalLink size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-asklegal-text/70 theme-transition">No news articles found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default News;
