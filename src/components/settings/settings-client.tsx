'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CURRENCIES } from '@/lib/constants';
import { ThemeSwitcher } from './theme-switcher';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';


const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  businessName: z.string().min(1, 'Business name is required'),
});

function ProfileSettings() {
  const { settings, updateSettings } = useAppStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: settings.profile,
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateSettings({ profile: values });
    toast({ title: 'Profile updated successfully!' });
  };
  
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <Avatar className="h-20 w-20">
            {userAvatar ? <AvatarImage src={userAvatar.imageUrl} alt={settings.profile.name} /> : null}
            <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold truncate">{settings.profile.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{settings.profile.businessName}</p>
          </div>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
        </form>
        </Form>
    </>
  );
}

function AppearanceSettings() {
  const { settings, updateSettings } = useAppStore();
  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
  };

  return (
    <div className="space-y-8">
        <div>
            <FormLabel>Theme</FormLabel>
            <ThemeSwitcher/>
        </div>
        <div>
            <FormLabel>Currency</FormLabel>
            <Select onValueChange={handleCurrencyChange} defaultValue={settings.currency}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                    <SelectItem key={code} value={code}>
                        {symbol} - {name} ({code})
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
    );
}

function DataSettings() {
  const { resetData } = useAppStore();
  const { toast } = useToast();

  const handleReset = () => {
    resetData();
    toast({ title: 'Application Reset', description: 'All your data has been cleared.' });
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Reset Application Data</CardTitle>
        <CardDescription>This action is irreversible. This will permanently delete all transactions, daily logs, debts, and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Reset App Data</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                Yes, reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export function SettingsClient() {
  return (
    <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your personal and business information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileSettings />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="appearance">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the app.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AppearanceSettings />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="data">
             <DataSettings />
        </TabsContent>
    </Tabs>
  );
}
