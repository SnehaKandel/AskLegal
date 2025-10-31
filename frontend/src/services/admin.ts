import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const adminService = {
  async getUsers(params: GetUsersParams = {}) {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async getUserDetails(userId: string) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.user;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive') {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status });
      toast({
        title: 'Success',
        description: `User status updated to ${status}`,
      });
      return response.data.user;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
      throw error;
    }
  }
};
