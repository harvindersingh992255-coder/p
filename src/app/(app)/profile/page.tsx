'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  educationLevel: z.string().optional(),
  targetJobRole: z.string().optional(),
  targetIndustry: z.string().optional(),
  experienceLevel: z.number().min(0).max(40).default(0),
  careerGoals: z.string().optional(),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    // MOCK: In a real app, this data would be fetched for the logged-in user
    defaultValues: {
      id: '',
      name: '',
      email: '',
      avatarUrl: '',
      educationLevel: '',
      targetJobRole: '',
      targetIndustry: '',
      experienceLevel: 0,
      careerGoals: '',
    },
  });

  function onSubmit(values: UserProfile) {
    // MOCK: In a real app, you would save this data to your backend
    console.log(values);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-muted-foreground">Keep your personal and career information up to date.</p>
        </div>
      </div>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
            </CardContent>

            <CardHeader className="pt-0">
                <CardTitle>Career Details</CardTitle>
                <CardDescription>This information helps us tailor your interview experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="targetJobRole"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target Job Role</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Product Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="targetIndustry"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target Industry</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., E-commerce" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Highest Education Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your education level" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="High School">High School</SelectItem>
                                <SelectItem value="Associates Degree">Associate's Degree</SelectItem>
                                <SelectItem value="Bachelors Degree">Bachelor's Degree</SelectItem>
                                <SelectItem value="Masters Degree">Master's Degree</SelectItem>
                                <SelectItem value="PhD">PhD</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider
                                    min={0}
                                    max={40}
                                    step={1}
                                    value={[field.value || 0]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="careerGoals"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Career Goals</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Describe your long-term career aspirations..."
                            className="min-h-[120px]"
                            {...field}
                        />
                        </FormControl>
                        <FormDescription>
                            What do you hope to achieve in your career in the next 5-10 years?
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div className="flex justify-end">
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
