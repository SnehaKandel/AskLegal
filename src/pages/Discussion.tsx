
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Plus, 
  TrendingUp,
  Clock,
  Users,
  Filter
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  category: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  createdAt: Date;
  tags: string[];
  isPinned?: boolean;
  isSolved?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Constitutional Rights in Property Disputes - Need Clarification',
    content: 'I am facing a property dispute where the other party claims constitutional protection. Can someone explain how Article 25 applies to property rights in Nepal?',
    author: { name: 'Legal_Student_2024', reputation: 245 },
    category: 'Constitutional Law',
    upvotes: 23,
    downvotes: 2,
    comments: 15,
    createdAt: new Date('2024-01-20'),
    tags: ['property-rights', 'constitution', 'article-25'],
    isPinned: true
  },
  {
    id: '2',
    title: 'Corporate Law: Foreign Investment Regulations Update',
    content: 'Recent changes in foreign investment laws - what are the new compliance requirements for tech startups?',
    author: { name: 'StartupLawyer', reputation: 892 },
    category: 'Corporate Law',
    upvotes: 45,
    downvotes: 1,
    comments: 28,
    createdAt: new Date('2024-01-19'),
    tags: ['foreign-investment', 'startups', 'compliance'],
    isSolved: true
  },
  {
    id: '3',
    title: 'Labor Law: Maternity Leave Rights for Domestic Workers',
    content: 'Are domestic workers entitled to the same maternity benefits as other employees under the new Labor Act?',
    author: { name: 'WomensRights_Advocate', reputation: 567 },
    category: 'Labor Law',
    upvotes: 31,
    downvotes: 0,
    comments: 12,
    createdAt: new Date('2024-01-18'),
    tags: ['maternity-leave', 'domestic-workers', 'labor-act']
  },
  {
    id: '4',
    title: 'Criminal Law: Digital Evidence Admissibility in Court',
    content: 'What are the current standards for admitting digital evidence (WhatsApp messages, emails) in criminal proceedings?',
    author: { name: 'CriminalDefenseAtty', reputation: 1234 },
    category: 'Criminal Law',
    upvotes: 67,
    downvotes: 3,
    comments: 34,
    createdAt: new Date('2024-01-17'),
    tags: ['digital-evidence', 'criminal-procedure', 'admissibility']
  },
  {
    id: '5',
    title: 'Family Law: Child Custody in International Marriages',
    content: 'How does Nepal handle child custody cases when parents are from different countries?',
    author: { name: 'FamilyLaw_Expert', reputation: 445 },
    category: 'Family Law',
    upvotes: 18,
    downvotes: 1,
    comments: 9,
    createdAt: new Date('2024-01-16'),
    tags: ['child-custody', 'international-law', 'family-disputes']
  }
];

const categories = [
  'All Categories',
  'Constitutional Law',
  'Corporate Law', 
  'Criminal Law',
  'Family Law',
  'Labor Law',
  'Property Law',
  'Tax Law',
  'Environmental Law',
  'Human Rights'
];

const Discussion = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'trending' && post.upvotes > 20) ||
                      (activeTab === 'solved' && post.isSolved) ||
                      (activeTab === 'unanswered' && post.comments === 0);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'comments':
        return b.comments - a.comments;
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-asklegal-heading mb-2">Legal Discussions</h1>
            <p className="text-asklegal-text/70">Ask questions, share knowledge, and engage with the legal community</p>
          </div>
          <Button onClick={() => navigate('/discussion/create')} className="mt-4 md:mt-0 bg-asklegal-purple hover:bg-asklegal-purple/80">
            <Plus size={18} className="mr-2" />
            New Discussion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-asklegal-text/70">Total Posts</p>
                  <p className="text-2xl font-bold text-asklegal-heading">1,247</p>
                </div>
                <MessageSquare className="text-asklegal-purple" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-asklegal-text/70">Active Users</p>
                  <p className="text-2xl font-bold text-asklegal-heading">892</p>
                </div>
                <Users className="text-asklegal-accent" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-asklegal-text/70">Solved Today</p>
                  <p className="text-2xl font-bold text-asklegal-heading">23</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-asklegal-text/70">Response Time</p>
                  <p className="text-2xl font-bold text-asklegal-heading">2.4h</p>
                </div>
                <Clock className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asklegal-text/50" size={18} />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <Card key={post.id} className="card-glassmorphism hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate(`/discussion/post/${post.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center min-w-[60px]">
                        <button className="p-1 hover:bg-asklegal-purple/10 rounded">
                          <ThumbsUp size={16} className="text-asklegal-text/60" />
                        </button>
                        <span className="text-sm font-semibold text-asklegal-heading my-1">
                          {post.upvotes - post.downvotes}
                        </span>
                        <button className="p-1 hover:bg-red-500/10 rounded">
                          <ThumbsDown size={16} className="text-asklegal-text/60" />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {post.isPinned && (
                                <Badge variant="secondary" className="bg-asklegal-purple/10 text-asklegal-purple">
                                  Pinned
                                </Badge>
                              )}
                              {post.isSolved && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Solved
                                </Badge>
                              )}
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-asklegal-heading mb-2 hover:text-asklegal-purple transition-colors">
                              {post.title}
                            </h3>
                            
                            <p className="text-asklegal-text/80 line-clamp-2 mb-3">
                              {post.content}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Author and Stats */}
                        <div className="flex items-center justify-between text-sm text-asklegal-text/60">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {post.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{post.author.name}</span>
                            <span>({post.author.reputation} rep)</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{post.comments}</span>
                            </div>
                            <span>{getTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-asklegal-text/30 mb-4" />
            <h3 className="text-xl font-semibold text-asklegal-heading mb-2">No discussions found</h3>
            <p className="text-asklegal-text/60 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => navigate('/discussion/create')} className="bg-asklegal-purple hover:bg-asklegal-purple/80">
              Start a New Discussion
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Discussion;
