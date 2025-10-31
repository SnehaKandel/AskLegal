
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface LoginCredentials {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      // Changed from /auth/login to /api/auth/login to match backend routes
      const response = await api.post('/api/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error details:', error.response?.data || error.message);
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      console.log('Auth service sending register request:', data);
      // Changed from /auth/register to /api/auth/register to match backend routes
      const response = await api.post('/api/auth/register', data);
      console.log('Register response:', response.data);
      
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Registration error details:', error.response?.data || error.message);
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async logout() {
    try {
      // Changed from /auth/logout to /api/auth/logout to match backend routes
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },
};
