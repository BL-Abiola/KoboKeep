
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRENCIES } from '@/lib/constants';
import { Wallet } from 'lucide-react';
import { Progress } from '../ui/progress';

const onboardingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  businessName: z.string().min(1, 'Business name is required'),
  currency: z.string().min(1, "Currency is required"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const steps = [
  {
    title: "Welcome to KoboKeep!",
    description: "Let's get your profile set up.",
    fields: ['name', 'businessName', 'currency'],
  },
];

export function WelcomeDialog() {
  const { settings, updateSettings } = useAppStore();
  const [step, setStep] = useState(0);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: settings.profile.name === 'User' ? '' : settings.profile.name,
      businessName: settings.profile.businessName === 'My Business' ? '' : settings.profile.businessName,
      currency: settings.currency,
    },
  });

  const onSubmit = (values: OnboardingValues) => {
    updateSettings({
      profile: {
        name: values.name,
        businessName: values.businessName,
      },
      currency: values.currency,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold font-headline">KoboKeep</h1>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-2">
                <div className="text-center mb-6">
                    <CardTitle className="text-xl font-bold font-headline">{steps[step].title}</CardTitle>
                    <CardDescription>{steps[step].description}</CardDescription>
                </div>

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="e.g. John's Coffee Shop" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                            <SelectItem key={code} value={code}>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{symbol}</span>
                                  <span>{name} ({code})</span>
                                </div>
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="w-full">Get Started</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
