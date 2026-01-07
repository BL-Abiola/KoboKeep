
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Github } from 'lucide-react';
import Link from 'next/link';


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
  
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-w-sm">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            </div>
            <div className="max-w-sm">
                <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
            </div>
            <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
        </form>
    </Form>
  );
}

function AppearanceSettings() {
  const { settings, updateSettings } = useAppStore();
  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
  };

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <Label className="text-sm font-medium">Theme</Label>
            <ThemeSwitcher/>
        </div>
        <div className="space-y-2">
            <Label className="text-sm font-medium">Currency</Label>
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

function AboutSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>About Kobokeep</CardTitle>
                <CardDescription>A simple bookkeeping app for small businesses.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4 py-4 text-sm text-foreground">
                    <div>
                        <h3 className="font-semibold">Purpose</h3>
                        <p className="text-muted-foreground">
                        A simple bookkeeping app that helps small business owners track sales, expenses, and debts.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Built with</h3>
                        <p className="text-muted-foreground">
                        Next.js, React, ShadCN, and Tailwind CSS.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Author</h3>
                        <p className="text-muted-foreground">Firebase Team</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Source Code</h3>
                        <Button variant="outline" asChild>
                        <Link href="https://github.com/firebase/studio-apps/tree/main/isuna" target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function SettingsClient() {
  return (
    <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
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
         <TabsContent value="about">
             <AboutSection />
        </TabsContent>
    </Tabs>
  );
}
