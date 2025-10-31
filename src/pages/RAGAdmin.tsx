
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { ragService } from '@/services/rag';
import { useToast } from '@/hooks/use-toast';

const RAGAdmin = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser.role !== 'admin') {
      toast({
        title: "Unauthorized Access",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    loadStatus();
  }, [navigate, toast]);

  const loadStatus = async () => {
    const statusData = await ragService.getStatus();
    setStatus(statusData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Please select maximum 5 PDF files.",
        variant: "destructive",
      });
      return;
    }
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select PDF files to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await ragService.uploadPDFs(files);
      setFiles(null);
      // Reset file input
      const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await loadStatus();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-asklegal-purple mb-8">RAG System Administration</h1>
        
        {/* Status Card */}
        <Card className="card-glassmorphism mb-8">
          <CardHeader>
            <CardTitle className="text-asklegal-heading theme-transition flex items-center gap-2">
              <FileText size={24} className="text-asklegal-purple" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-asklegal-purple/10 rounded-lg">
                  <div className="text-2xl font-bold text-asklegal-purple">{status.filesUploaded}</div>
                  <div className="text-sm text-asklegal-text/70 theme-transition">PDF Files</div>
                </div>
                <div className="text-center p-4 bg-asklegal-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-asklegal-accent">{status.documentsCount}</div>
                  <div className="text-sm text-asklegal-text/70 theme-transition">Document Chunks</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {status.documentsCount > 0 ? 'Ready' : 'Pending'}
                  </div>
                  <div className="text-sm text-asklegal-text/70 theme-transition">System Status</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-asklegal-text/70 theme-transition">Loading status...</div>
              </div>
            )}
            
            {status && status.files.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-asklegal-heading theme-transition mb-2">Uploaded Files:</h4>
                <ul className="space-y-1">
                  {status.files.map((filename: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-asklegal-text/80 theme-transition">
                      <CheckCircle size={16} className="text-green-500" />
                      {filename}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card className="card-glassmorphism">
          <CardHeader>
            <CardTitle className="text-asklegal-heading theme-transition flex items-center gap-2">
              <Upload size={24} className="text-asklegal-purple" />
              Upload Constitution PDFs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-asklegal-text/70 theme-transition">
                <AlertCircle size={16} />
                <span className="text-sm">Upload up to 5 PDF files. Existing files will be replaced.</span>
              </div>
              
              <div className="border-2 border-dashed border-asklegal-purple/30 rounded-lg p-6 text-center">
                <input
                  id="pdf-input"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pdf-input" className="cursor-pointer">
                  <Upload size={48} className="mx-auto text-asklegal-purple mb-4" />
                  <div className="text-asklegal-heading theme-transition font-medium mb-2">
                    Click to select PDF files
                  </div>
                  <div className="text-sm text-asklegal-text/70 theme-transition">
                    Select up to 5 PDF files (Max 10MB each)
                  </div>
                </label>
              </div>
              
              {files && files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-asklegal-heading theme-transition">Selected Files:</h4>
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-asklegal-text/80 theme-transition">
                      <FileText size={16} className="text-asklegal-purple" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                onClick={handleUpload}
                disabled={!files || files.length === 0 || uploading}
                className="w-full bg-asklegal-purple hover:bg-asklegal-purple/90"
              >
                {uploading ? 'Processing...' : 'Upload and Process PDFs'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RAGAdmin;
