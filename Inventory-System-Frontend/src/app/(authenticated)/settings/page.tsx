
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Settings as SettingsIcon, Mail, Key, Eye, EyeOff, 
  Sun, Moon, Palette, Bell, Shield, Database, Globe, Shapes, Plus, Trash2, Edit, Building, Eraser
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Category, CompanyProfile } from '@/types';
import { categoriesRepository } from '@/lib/categories-repository';
import AddCategoryForm from '@/components/forms/AddCategoryForm';
import EditCategoryForm from '@/components/forms/EditCategoryForm';
import { Skeleton } from '@/components/ui/skeleton';
import { companyRepository } from '@/lib/company-repository';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';

const colorOptions = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500', hsl: { primary: '210 100% 45%', ring: '210 100% 45%' } },
    { value: 'green', label: 'Green', color: 'bg-green-500', hsl: { primary: '142 76% 36%', ring: '142 76% 36%' } },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500', hsl: { primary: '262 84% 58%', ring: '262 84% 58%' } },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500', hsl: { primary: '25 95% 53%', ring: '25 95% 53%' } },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500', hsl: { primary: '330 84% 60%', ring: '330 84% 60%' } },
];


const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState('account');
  const [accentColor, setAccentColor] = useState('blue');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({ name: '', address: '', phone: ''});
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [dataToDelete, setDataToDelete] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    setIsLoadingCategories(true);
    try {
      const data = categoriesRepository.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories.");
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchCompanyProfile = useCallback(() => {
    setIsLoadingCompany(true);
    try {
        const data = companyRepository.get();
        setCompanyProfile(data);
    } catch(error) {
        toast.error("Failed to load company profile.");
    } finally {
        setIsLoadingCompany(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab === 'categories') {
      fetchCategories();
    }
    if(currentTab === 'company') {
      fetchCompanyProfile();
    }
  }, [currentTab, fetchCategories, fetchCompanyProfile]);
  
  useEffect(() => {
    // Load saved appearance settings from localStorage
    const savedTheme = localStorage.getItem('cims-theme');
    const savedAccent = localStorage.getItem('cims-accent-color');
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) {
        setAccentColor(savedAccent);
        applyAccentColor(savedAccent);
    }
  }, [setTheme]);

  const applyAccentColor = (colorValue: string) => {
    const color = colorOptions.find(c => c.value === colorValue);
    if (color && document) {
      const root = document.documentElement;
      root.style.setProperty('--primary', color.hsl.primary);
      root.style.setProperty('--ring', color.hsl.ring);
    }
  }

  const handleCategoryDataChange = () => {
    fetchCategories();
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteCategoryOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      try {
        categoriesRepository.delete(selectedCategory.id);
        toast.success(`Category "${selectedCategory.name}" deleted successfully.`);
        handleCategoryDataChange();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An error occurred.");
      } finally {
        setDeleteCategoryOpen(false);
        setSelectedCategory(null);
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account updated", {
      description: "Your account information has been updated successfully.",
    });
  };

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        companyRepository.save(companyProfile);
        toast.success("Company profile updated successfully.");
    } catch (error) {
        toast.error("Failed to save company profile.");
    }
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password changed", {
      description: "Your password has been changed successfully.",
    });
  };

  const handleAppearanceChange = () => {
    localStorage.setItem('cims-theme', theme || 'system');
    localStorage.setItem('cims-accent-color', accentColor);
    applyAccentColor(accentColor);
    toast.success("Appearance updated", {
      description: "Your appearance settings have been updated.",
    });
  };

  const handleClearData = () => {
    if (!dataToDelete) return;

    if (dataToDelete === 'all') {
      localStorage.removeItem('cims_items');
      localStorage.removeItem('cims_orders');
      localStorage.removeItem('cims_activity_logs');
      localStorage.removeItem('cims_categories');
      localStorage.removeItem('cims_company_profile');
      toast.success('All application data has been reset.', {
        description: 'The page will now reload.',
      });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      localStorage.removeItem(`cims_${dataToDelete}`);
      toast.success(`All ${dataToDelete} have been cleared.`, {
        description: 'The changes will be visible across the app.',
      });
      // Trigger storage events to update other components
      window.dispatchEvent(new Event(`cims-${dataToDelete}-storage`));
    }
    setDataToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid md:grid-cols-4 lg:grid-cols-7 w-full h-auto">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
           <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
           <TabsTrigger value="categories" className="flex items-center gap-2">
            <Shapes className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account information and email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username || ''} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ''} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Administrator" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your role determines your permissions within the system
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your current password"
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="new-password" 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Enter your new password"
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={toggleShowNewPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters and include a mix of letters, numbers, and symbols
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                This information will appear on invoices and other documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCompany ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-1/3" />
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveCompanyProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyProfile.name}
                      onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Textarea
                      id="company-address"
                      value={companyProfile.address}
                      onChange={(e) => setCompanyProfile({...companyProfile, address: e.target.value})}
                      placeholder="123 Main Street, Manila, Philippines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input
                      id="company-phone"
                      value={companyProfile.phone}
                      onChange={(e) => setCompanyProfile({...companyProfile, phone: e.target.value})}
                      placeholder="+63 123 456 7890"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Save Company Profile</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Add, edit, or delete inventory categories.
                </CardDescription>
              </div>
              <Button onClick={() => setAddCategoryOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCategories ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteCategory(category)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No categories found. Add one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Theme Mode</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose between light, dark, or system theme
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      onClick={() => setTheme('light')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'light' ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center h-20 mb-4 bg-background rounded-md border">
                        <Sun className="h-8 w-8 text-foreground" />
                      </div>
                      <p className="text-center font-medium">Light</p>
                    </div>
                    <div
                      onClick={() => setTheme('dark')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'dark' ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center h-20 mb-4 bg-slate-800 rounded-md border">
                        <Moon className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-center font-medium">Dark</p>
                    </div>
                    <div
                      onClick={() => setTheme('system')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'system' ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center h-20 mb-4 bg-gradient-to-r from-background to-slate-800 rounded-md border">
                        <div className="flex">
                          <Sun className="h-8 w-8 text-foreground" />
                          <Moon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Accent Color</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select an accent color for buttons and highlights
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map(option => (
                      <div 
                        key={option.value}
                        onClick={() => setAccentColor(option.value)}
                        className={`flex flex-col items-center cursor-pointer transition-all ${
                          accentColor === option.value ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${option.color} mb-2 ${
                          accentColor === option.value ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''
                        }`} />
                        <span className="text-xs">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Animations</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable interface animations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Compact Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact interface layout
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleAppearanceChange}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Notification settings coming soon</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Security settings coming soon</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your local application data. These actions cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Clear Inventory Items</h3>
                  <p className="text-sm text-muted-foreground">Deletes all items from your inventory.</p>
                </div>
                <Button variant="destructive" onClick={() => setDataToDelete('items')}>Clear Items</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Clear Orders</h3>
                  <p className="text-sm text-muted-foreground">Deletes all order history.</p>
                </div>
                <Button variant="destructive" onClick={() => setDataToDelete('orders')}>Clear Orders</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Clear Activity Logs</h3>
                  <p className="text-sm text-muted-foreground">Deletes all system activity history.</p>
                </div>
                <Button variant="destructive" onClick={() => setDataToDelete('activity_logs')}>Clear Logs</Button>
              </div>
              <Separator />
               <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-destructive">Reset All Data</h3>
                  <p className="text-sm text-muted-foreground">Permanently deletes all items, orders, and settings.</p>
                </div>
                <Button variant="destructive" onClick={() => setDataToDelete('all')}>
                    <Eraser className="mr-2 h-4 w-4" />
                    Reset Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddCategoryForm 
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onSuccess={handleCategoryDataChange}
      />

      <EditCategoryForm
        category={selectedCategory}
        open={editCategoryOpen}
        onOpenChange={setEditCategoryOpen}
        onSuccess={handleCategoryDataChange}
      />
      
      <AlertDialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              category "{selectedCategory?.name}". Any items in this category will not be deleted but will need to be reassigned to a new category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={!!dataToDelete} onOpenChange={(open) => !open && setDataToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to permanently delete 
              {dataToDelete === 'all' ? ' all application data' : ` all ${dataToDelete?.replace('_', ' ')}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDataToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default SettingsPage;
