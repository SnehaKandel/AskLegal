
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2,
  Flag,
  Award,
  Reply
} from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    reputation: number;
    isVerified?: boolean;
  };
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  replies?: Comment[];
  isAccepted?: boolean;
}

const mockPost = {
  id: '1',
  title: 'Constitutional Rights in Property Disputes - Need Clarification',
  content: `I am facing a property dispute where the other party claims constitutional protection. Can someone explain how Article 25 applies to property rights in Nepal?

The situation involves a family property that was transferred to my name 5 years ago, but now a distant relative is claiming rights based on constitutional provisions. They argue that the transfer violated their fundamental rights under Article 25.

Specifically, I need clarification on:
1. How does Article 25 protect property rights?
2. Can constitutional rights override properly executed property transfers?
3. What legal precedents exist for such cases?

Any insights from legal professionals or those who have faced similar situations would be greatly appreciated.`,
  author: { name: 'Legal_Student_2024', reputation: 245 },
  category: 'Constitutional Law',
  upvotes: 23,
  downvotes: 2,
  comments: 15,
  createdAt: new Date('2024-01-20'),
  tags: ['property-rights', 'constitution', 'article-25'],
  isPinned: true
};

const mockComments: Comment[] = [
  {
    id: '1',
    content: `Article 25 of Nepal's Constitution does protect property rights, but it's not absolute. The right to property is subject to reasonable restrictions in the public interest.

In your case, the key question is whether the original transfer was legally valid and whether it violated any existing rights. Constitutional protection doesn't automatically invalidate proper legal transfers.

I'd recommend consulting with a constitutional lawyer who can review the specific details of your case.`,
    author: { name: 'Constitutional_Expert', reputation: 1567, isVerified: true },
    upvotes: 15,
    downvotes: 0,
    createdAt: new Date('2024-01-20'),
    isAccepted: true,
    replies: [
      {
        id: '1-1',
        content: 'Thank you for this explanation. Could you elaborate on what constitutes "reasonable restrictions" in property matters?',
        author: { name: 'Legal_Student_2024', reputation: 245 },
        upvotes: 3,
        downvotes: 0,
        createdAt: new Date('2024-01-20')
      },
      {
        id: '1-2',
        content: `Reasonable restrictions typically include:
1. Public interest (eminent domain)
2. Environmental protection
3. Urban planning requirements
4. Tax obligations

However, these don't usually apply to family property disputes unless there's a clear public interest involved.`,
        author: { name: 'Constitutional_Expert', reputation: 1567, isVerified: true },
        upvotes: 8,
        downvotes: 0,
        createdAt: new Date('2024-01-20')
      }
    ]
  },
  {
    id: '2',
    content: `I faced a similar situation last year. The key is to examine the original property documents and ensure all legal procedures were followed during the transfer.

In my case, the court ruled that constitutional rights cannot be used to challenge properly executed property transfers unless there's evidence of fraud or coercion.

Document everything and get a good property lawyer!`,
    author: { name: 'PropertyOwner_2023', reputation: 334 },
    upvotes: 12,
    downvotes: 1,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    content: `From a legal precedent perspective, the Supreme Court has generally upheld valid property transfers even when challenged on constitutional grounds.

Check out the case of "Sharma vs. Shrestha (2019)" which dealt with similar constitutional challenges to property rights.

The court emphasized that constitutional protection exists to prevent arbitrary state action, not to invalidate private property transactions conducted according to law.`,
    author: { name: 'LawStudent_Researcher', reputation: 189 },
    upvotes: 7,
    downvotes: 0,
    createdAt: new Date('2024-01-20')
  }
];

const DiscussionPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Here you would normally submit to backend
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      // Here you would normally submit reply to backend
      console.log('Reply to comment', commentId, ':', replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

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

  const renderComment = (comment: Comment, isReply = false) => (
    <Card key={comment.id} className={`card-glassmorphism ${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center min-w-[40px]">
            <button className="p-1 hover:bg-asklegal-purple/10 rounded">
              <ThumbsUp size={14} className="text-asklegal-text/60" />
            </button>
            <span className="text-sm font-semibold text-asklegal-heading my-1">
              {comment.upvotes - comment.downvotes}
            </span>
            <button className="p-1 hover:bg-red-500/10 rounded">
              <ThumbsDown size={14} className="text-asklegal-text/60" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {comment.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-asklegal-heading">{comment.author.name}</span>
              <span className="text-sm text-asklegal-text/60">({comment.author.reputation} rep)</span>
              {comment.author.isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Verified
                </Badge>
              )}
              {comment.isAccepted && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <Award size={12} />
                  Accepted Answer
                </Badge>
              )}
              <span className="text-sm text-asklegal-text/60 ml-auto">{getTimeAgo(comment.createdAt)}</span>
            </div>

            <div className="prose prose-sm max-w-none text-asklegal-text mb-3">
              {comment.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button 
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-asklegal-text/60 hover:text-asklegal-purple transition-colors"
              >
                <Reply size={14} />
                Reply
              </button>
              <button className="flex items-center gap-1 text-asklegal-text/60 hover:text-asklegal-purple transition-colors">
                <Share2 size={14} />
                Share
              </button>
              <button className="flex items-center gap-1 text-asklegal-text/60 hover:text-red-500 transition-colors">
                <Flag size={14} />
                Report
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 p-3 bg-asklegal-form-bg/20 rounded">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-2"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSubmitReply(comment.id)}
                    size="sm"
                    className="bg-asklegal-purple hover:bg-asklegal-purple/80"
                  >
                    Post Reply
                  </Button>
                  <Button 
                    onClick={() => setReplyingTo(null)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/discussion')} 
          variant="ghost" 
          className="mb-6 text-asklegal-text/70 hover:text-asklegal-purple"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Discussions
        </Button>

        {/* Post */}
        <Card className="card-glassmorphism mb-8">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center min-w-[60px]">
                <button className="p-2 hover:bg-asklegal-purple/10 rounded">
                  <ThumbsUp size={20} className="text-asklegal-text/60" />
                </button>
                <span className="text-lg font-bold text-asklegal-heading my-2">
                  {mockPost.upvotes - mockPost.downvotes}
                </span>
                <button className="p-2 hover:bg-red-500/10 rounded">
                  <ThumbsDown size={20} className="text-asklegal-text/60" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  {mockPost.isPinned && (
                    <Badge variant="secondary" className="bg-asklegal-purple/10 text-asklegal-purple">
                      Pinned
                    </Badge>
                  )}
                  <Badge variant="outline">{mockPost.category}</Badge>
                </div>

                <h1 className="text-2xl font-bold text-asklegal-heading mb-4">
                  {mockPost.title}
                </h1>

                <div className="prose prose-lg max-w-none text-asklegal-text mb-6">
                  {mockPost.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {mockPost.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-asklegal-form-border/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {mockPost.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-asklegal-heading">{mockPost.author.name}</span>
                      <span className="text-sm text-asklegal-text/60 ml-2">({mockPost.author.reputation} rep)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-asklegal-text/60">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      <span>{mockPost.comments} answers</span>
                    </div>
                    <span>{getTimeAgo(mockPost.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-asklegal-heading mb-6">
            {mockComments.length} Answers
          </h2>
          
          {mockComments.map(comment => renderComment(comment))}
        </div>

        {/* Add Comment */}
        <Card className="card-glassmorphism">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-asklegal-heading mb-4">Your Answer</h3>
            <Textarea
              placeholder="Share your legal knowledge and help the community..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4"
              rows={6}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-asklegal-text/60">
                Please provide detailed, helpful answers backed by legal knowledge or experience.
              </p>
              <Button 
                onClick={handleSubmitComment}
                className="bg-asklegal-purple hover:bg-asklegal-purple/80"
                disabled={!newComment.trim()}
              >
                Post Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DiscussionPost;
