
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Plus } from 'lucide-react';

const categories = [
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

const CreateDiscussion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase().replace(/\s+/g, '-')]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating discussion:', formData);
      navigate('/discussion');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/discussion')} 
            variant="ghost" 
            className="text-asklegal-text/70 hover:text-asklegal-purple"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-asklegal-heading">Start a New Discussion</h1>
            <p className="text-asklegal-text/70">Ask the legal community for help and advice</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-asklegal-heading">Your Question</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-asklegal-heading mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Be specific and imagine you're asking a question to another person"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg"
                      maxLength={150}
                    />
                    <p className="text-xs text-asklegal-text/60 mt-1">
                      {formData.title.length}/150 characters
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-asklegal-heading mb-2">
                      Details <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Provide all the details someone would need to answer your question. Include relevant background information, specific circumstances, and what kind of help you're looking for."
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={12}
                      className="resize-none"
                    />
                    <p className="text-xs text-asklegal-text/60 mt-1">
                      Minimum 50 characters. Be detailed and specific.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-asklegal-heading mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the most relevant legal category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-asklegal-heading mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add relevant tags (press Enter)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddTag}
                        variant="outline"
                        disabled={!currentTag.trim() || formData.tags.length >= 5}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-asklegal-text/60">
                      Add up to 5 tags to help categorize your question. Use keywords others might search for.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit"
                      className="bg-asklegal-purple hover:bg-asklegal-purple/80"
                      disabled={!formData.title.trim() || !formData.content.trim() || !formData.category || isSubmitting}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Discussion'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/discussion')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-lg text-asklegal-heading">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-asklegal-heading mb-1">Be Specific</h4>
                  <p className="text-asklegal-text/70">Include relevant details, dates, and circumstances that matter to your question.</p>
                </div>
                <div>
                  <h4 className="font-medium text-asklegal-heading mb-1">Provide Context</h4>
                  <p className="text-asklegal-text/70">Explain the background and why this question is important to you.</p>
                </div>
                <div>
                  <h4 className="font-medium text-asklegal-heading mb-1">Use Clear Language</h4>
                  <p className="text-asklegal-text/70">Write in plain language that anyone can understand, even complex legal concepts.</p>
                </div>
                <div>
                  <h4 className="font-medium text-asklegal-heading mb-1">Research First</h4>
                  <p className="text-asklegal-text/70">Check if your question has already been answered in previous discussions.</p>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-lg text-asklegal-heading">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-asklegal-text/70">
                <p>• Be respectful and professional</p>
                <p>• No personal attacks or harassment</p>
                <p>• Focus on legal questions, not personal advice</p>
                <p>• Don't share confidential information</p>
                <p>• Cite sources when referencing laws or cases</p>
                <p>• Mark resolved questions as solved</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDiscussion;
