import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  Clock,
  Newspaper,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsService, NewsArticle, SchedulerStatus } from '@/services/news';

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    fetchSources();
    fetchSchedulerStatus();
  }, [currentPage, selectedSource]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20
      };
      
      if (selectedSource) params.source = selectedSource;

      const response = await newsService.getNews(params);
      setNews(response.news);
      setTotalPages(response.pages || 1);
      setTotalNews(response.total || 0);
      
      if (response.scheduler) {
        setSchedulerStatus(response.scheduler);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch news',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await newsService.getNewsSources();
      setSources(response.sources);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchSchedulerStatus = async () => {
    try {
      const response = await newsService.getSchedulerStatus();
      setSchedulerStatus(response.status);
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchNews();
      toast({
        title: 'Success',
        description: 'News refreshed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh news',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source === selectedSource ? '' : source);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openNewsLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading && news.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Latest News</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest news from Nepal
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Scheduler Status */}
      {schedulerStatus && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Auto-update:</span>
                <Badge variant={schedulerStatus.isRunning ? 'default' : 'secondary'}>
                  {schedulerStatus.isRunning ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="text-muted-foreground">
                {schedulerStatus.lastRun && (
                  <span>Last update: {newsService.formatDate(schedulerStatus.lastRun)}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Filters */}
      {sources.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Sources:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <Button
                  key={source}
                  variant={selectedSource === source ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSourceChange(source)}
                >
                  {source}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Count */}
      <div className="text-sm text-muted-foreground">
        Showing {news.length} of {totalNews} articles
      </div>

      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((article) => (
          <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* News Image */}
            {article.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{
                    imageRendering: 'auto',
                    imageRendering: '-webkit-optimize-contrast',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </div>
            )}
            
            <CardContent className="p-4">
              {/* Source Badge */}
              <div className="flex items-center justify-between mb-2">
                <Badge className={newsService.getSourceColor(article.source)}>
                  {article.source}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {newsService.formatDate(article.publishedAt)}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>

              {/* Summary */}
              {article.summary && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
              )}

              {/* Read More Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openNewsLink(article.url)}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Article
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* No News Found */}
      {news.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No news found</h3>
            <p className="text-muted-foreground">
              {selectedSource ? 'Try adjusting your filters' : 'No news articles available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
