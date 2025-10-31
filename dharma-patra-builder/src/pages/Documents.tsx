import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  X,
  File,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';

interface Document {
  _id: string;
  title: string;
  originalName: string;
  fileSize: number;
  status: 'processing' | 'processed' | 'error';
  processingError?: string;
  totalChunks: number;
  processedChunks: number;
  metadata: {
    category: string;
    tags: string[];
    pages?: number;
    textLength?: number;
  };
  uploadedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  isPublic: boolean;
  accessLevel: string;
}

interface UploadResult {
  filename: string;
  success: boolean;
  message: string;
  document?: {
    id: string;
    title: string;
    status: string;
  };
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    isPublic: true,
    accessLevel: 'public'
  });
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching documents...');
      
      const token = authService.getToken();
      console.log('Token available:', !!token);
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: 'Authentication Required',
          description: 'Please log in to view documents',
          variant: 'destructive',
        });
        return;
      }

      console.log('Making request to /api/documents...');
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Documents data received:', data);
      console.log('Number of documents:', data.documents?.length || 0);
      
      setDocuments(data.documents || []);
      
      if (data.documents?.length === 0) {
        console.log('No documents found in response');
      }
      
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selection triggered');
    const files = Array.from(event.target.files || []);
    console.log('Selected files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    console.log('PDF files:', pdfFiles.map(f => f.name));
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: 'Invalid file type',
        description: 'Some files are not PDFs and will be ignored',
        variant: 'destructive',
      });
    }
    
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
    console.log('Total selected files:', selectedFiles.length + pdfFiles.length);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: 'Invalid file type',
        description: 'Some files are not PDFs and will be ignored',
        variant: 'destructive',
      });
    }
    
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select PDF files to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadResults([]);
    
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Starting upload with files:', selectedFiles.map(f => f.name));

      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('pdfs', file);
      });
      formData.append('isPublic', uploadForm.isPublic.toString());
      formData.append('accessLevel', uploadForm.accessLevel);

      console.log('FormData created, sending request...');

      const response = await fetch('/api/documents/upload-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      setUploadResults(data.results);
      
      toast({
        title: 'Upload completed',
        description: data.message,
      });

      // Reset form and close modal after a delay
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadForm({
          isPublic: true,
          accessLevel: 'public'
        });
        setShowUploadModal(false);
        setUploadResults([]);
        fetchDocuments();
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload documents',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast({
        title: 'Document deleted',
        description: 'Document has been deleted successfully',
      });

      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: 'secondary',
      processed: 'default',
      error: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchDocuments}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredDocuments.length} of {documents.length} documents
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{doc.title}</h3>
                      {getStatusIcon(doc.status)}
                      {getStatusBadge(doc.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {doc.originalName} • {formatFileSize(doc.fileSize)}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Uploaded by: {doc.uploadedBy.name}</span>
                      <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                    {doc.status === 'processing' && doc.totalChunks > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Processing progress</span>
                          <span>{doc.processedChunks}/{doc.totalChunks} chunks</span>
                        </div>
                        <Progress value={(doc.processedChunks / doc.totalChunks) * 100} className="h-2" />
                      </div>
                    )}
                    {doc.status === 'error' && doc.processingError && (
                      <p className="text-sm text-red-600 mt-2">
                        Error: {doc.processingError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Upload Multiple Documents</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop PDF files here, or click to select
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" type="button">
                  Browse Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum 10 files, 10MB each
                </p>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <File className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Results */}
              {uploadResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Upload Results</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadResults.map((result, index) => (
                      <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                        result.success ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {result.success ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">{result.filename}</span>
                        <span className="text-xs text-gray-600">{result.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className="flex-1"
                >
                  {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 