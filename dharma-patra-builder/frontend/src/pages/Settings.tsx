import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { User, Lock, BellRing, BellOff } from 'lucide-react';

const Settings = () => {
  const [profileData, setProfileData] = useState({
    name: 'User Name',
    email: 'user@example.com',
    phone: '9841000000',
    district: 'Kathmandu',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    news: true,
    updates: true,
  });
  
  const { toast } = useToast();
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  const handleNotificationChange = (name: string) => {
    setNotifications({ ...notifications, [name]: !notifications[name as keyof typeof notifications] });
  };
  
  const saveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile details have been successfully updated.",
    });
  };
  
  const savePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation password do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const saveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been successfully updated.",
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-asklegal-purple mb-8">Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock size={16} />
                Password
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing size={16} />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleProfileChange}
                      className="bg-asklegal-dark/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={handleProfileChange}
                      className="bg-asklegal-dark/80"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleProfileChange}
                      className="bg-asklegal-dark/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input 
                      id="district" 
                      name="district" 
                      value={profileData.district} 
                      onChange={handleProfileChange}
                      className="bg-asklegal-dark/80"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={saveProfile}
                    className="bg-asklegal-purple hover:bg-asklegal-accent text-white"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="password" className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type="password" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange}
                    className="bg-asklegal-dark/80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange}
                    className="bg-asklegal-dark/80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange}
                    className="bg-asklegal-dark/80"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={savePassword}
                    className="bg-asklegal-purple hover:bg-asklegal-accent text-white"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-white">Email Notifications</h3>
                    <p className="text-sm text-white/70">Receive notifications via email</p>
                  </div>
                  <Button 
                    variant={notifications.email ? "default" : "outline"}
                    className={notifications.email ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50"}
                    onClick={() => handleNotificationChange('email')}
                  >
                    {notifications.email ? <BellRing size={16} /> : <BellOff size={16} />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-white">SMS Notifications</h3>
                    <p className="text-sm text-white/70">Receive notifications via SMS</p>
                  </div>
                  <Button 
                    variant={notifications.sms ? "default" : "outline"}
                    className={notifications.sms ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50"}
                    onClick={() => handleNotificationChange('sms')}
                  >
                    {notifications.sms ? <BellRing size={16} /> : <BellOff size={16} />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-white">News Updates</h3>
                    <p className="text-sm text-white/70">Get notified about new articles</p>
                  </div>
                  <Button 
                    variant={notifications.news ? "default" : "outline"}
                    className={notifications.news ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50"}
                    onClick={() => handleNotificationChange('news')}
                  >
                    {notifications.news ? <BellRing size={16} /> : <BellOff size={16} />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-white">System Updates</h3>
                    <p className="text-sm text-white/70">Get notified about system changes</p>
                  </div>
                  <Button 
                    variant={notifications.updates ? "default" : "outline"}
                    className={notifications.updates ? "bg-asklegal-purple" : "bg-transparent border-asklegal-purple/50"}
                    onClick={() => handleNotificationChange('updates')}
                  >
                    {notifications.updates ? <BellRing size={16} /> : <BellOff size={16} />}
                  </Button>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={saveNotifications}
                    className="bg-asklegal-purple hover:bg-asklegal-accent text-white"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
