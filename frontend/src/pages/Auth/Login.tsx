import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // 'user' or 'admin'
  });
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validate = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await authService.login(formData);
      
      toast({
        title: "Successfully logged in",
        description: user.role === 'admin' 
          ? "Welcome, Administrator" 
          : "Welcome to AskLegal.io",
      });
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-asklegal-purple mb-6 text-center">Login</h1>
          
          <div className="flex justify-center mb-6 gap-2">
            <Button
              type="button"
              variant={formData.role === 'user' ? "default" : "outline"} 
              className={formData.role === 'user' ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50 text-white"}
              onClick={() => handleRoleChange('user')}
            >
              User
            </Button>
            <Button
              type="button"
              variant={formData.role === 'admin' ? "default" : "outline"} 
              className={formData.role === 'admin' ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50 text-white"}
              onClick={() => handleRoleChange('admin')}
            >
              Admin
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-asklegal-dark/80"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-asklegal-dark/80"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="text-white/70 hover:text-white cursor-pointer">
                Forgot Password?
              </div>
              <div className="text-asklegal-purple hover:text-asklegal-accent cursor-pointer">
                Register
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-asklegal-purple hover:bg-asklegal-accent text-white"
            >
              {isLoading ? "Processing..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
