import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, UserX } from 'lucide-react';
import { adminService } from '@/services/admin';

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser.role !== 'admin') {
      toast({
        title: "अनधिकृत पहुँच",
        description: "तपाईंसँग यो पृष्ठमा पहुँच गर्ने अनुमति छैन।",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    fetchUsers();
  }, [navigate, toast, currentPage]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      
      // Map backend user data to match frontend format
      const mappedUsers = response.users.map((user: any) => ({
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastActive: user.lastActive,
      }));
      
      setUsers(mappedUsers);
      setTotalPages(response.pages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };
  
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await adminService.updateUserStatus(userId, newStatus as 'active' | 'inactive');
      
      // Update local user list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-asklegal-purple mb-8">प्रशासक ड्यासबोर्ड</h1>
        
        <div className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">प्रयोगकर्ता व्यवस्थापन</h2>
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="प्रयोगकर्ता खोज्नुहोस्..."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-asklegal-dark/80 pl-10"
              />
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white/50" size={16} />
            </form>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-white/70">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-asklegal-purple/30">
                    <th className="text-left py-4 px-2 text-white/70 font-medium">नाम</th>
                    <th className="text-left py-4 px-2 text-white/70 font-medium">इमेल</th>
                    <th className="text-left py-4 px-2 text-white/70 font-medium">भूमिका</th>
                    <th className="text-left py-4 px-2 text-white/70 font-medium">स्थिति</th>
                    <th className="text-left py-4 px-2 text-white/70 font-medium">अन्तिम सक्रिय</th>
                    <th className="text-right py-4 px-2 text-white/70 font-medium">कार्य</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-asklegal-purple/10 hover:bg-asklegal-purple/5">
                      <td className="py-4 px-2 text-white">{user.name}</td>
                      <td className="py-4 px-2 text-white/80">{user.email}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-asklegal-purple/20 text-asklegal-purple' 
                            : 'bg-asklegal-accent/20 text-asklegal-accent'
                        }`}>
                          {user.role === 'admin' ? 'प्रशासक' : 'प्रयोगकर्ता'}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {user.status === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-white/70">
                        {new Date(user.lastActive).toLocaleDateString('ne-NP')}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`bg-transparent border-asklegal-purple/30 ${
                            user.status === 'active' ? 'text-red-500' : 'text-green-500'
                          } hover:bg-asklegal-purple/5`}
                        >
                          <UserX size={16} className="mr-1" />
                          {user.status === 'active' ? 'निष्क्रिय' : 'सक्रिय'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/70">No users found.</p>
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? 
                          "bg-asklegal-purple" : 
                          "bg-transparent border-asklegal-purple/30 text-white"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
