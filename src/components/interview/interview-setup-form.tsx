'use client';

import { useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  jobRole: z.string().min(2, { message: 'Job role must be at least 2 characters.' }),
  industry: z.string().min(2, { message: 'Industry must be at least 2 characters.' }),
  interviewType: z.string({ required_error: 'Please select an interview type.' }),
  difficulty: z.number().min(1).max(5).default(3),
  customFocus: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const focusItems = [
  { id: 'technical', label: 'Technical Skills' },
  { id: 'behavioral', label: 'Behavioral Questions' },
  { id: 'situational', label: 'Situational Scenarios' },
  { id: 'communication', label: 'Communication Style' },
];

export function InterviewSetupForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      industry: '',
      difficulty: 3,
      customFocus: ['technical', 'behavioral'],
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    // In a real app, we would create a session and pass its ID
    const sessionId = 'new-session'; 
    const query = new URLSearchParams(values as any).toString();
    router.push(`/interview/active/${sessionId}?${query}`);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="text-primary" />
          Setup Your Mock Interview
        </CardTitle>
        <CardDescription>
          Customize your practice session to match the job you're applying for.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interviewType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an interview type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General / Screening</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customFocus"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Custom Focus Areas</FormLabel>
                    <FormDescription>
                      Select areas you want the AI to focus on during feedback.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  {focusItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="customFocus"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full">
              Start Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
