import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ProfileUpdateData {
  name?: string;
  phone?: string;
  district?: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  news: boolean;
  updates: boolean;
}

export const userService = {
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data.user;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async updateProfile(data: ProfileUpdateData) {
    try {
      const response = await api.put('/users/profile', data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      return response.data.user;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async updateNotifications(preferences: NotificationPreferences) {
    try {
      const response = await api.put('/users/notifications', preferences);
      toast({
        title: 'Success',
        description: 'Notification preferences updated',
      });
      return response.data.notificationPreferences;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to change password',
        variant: 'destructive',
      });
      throw error;
    }
  },
};
