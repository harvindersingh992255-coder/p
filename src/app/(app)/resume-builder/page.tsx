'use client';

import { useState } from 'react';
import { buildResume, BuildResumeOutput } from '@/ai/flows/resume-builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Loader2, Wand2, Lock, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

// MOCK: In a real app, this would come from user authentication
const userPlan = 'Free'; // 'Free', 'Premium', or 'Super'

export default function ResumeBuilderPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [builtResume, setBuiltResume] = useState<BuildResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const isPremiumFeature = userPlan === 'Free';

  const handleBuild = async () => {
    if (isPremiumFeature) return;
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste your existing resume or job details to build upon.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setBuiltResume(null);
    try {
      const result = await buildResume({ resumeText, jobDescription });
      setBuiltResume(result);
    } catch (error) {
      console.error('Resume building failed:', error);
      toast({
        title: 'Build Failed',
        description: 'Could not build your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (builtResume?.improvedVersion) {
      navigator.clipboard.writeText(builtResume.improvedVersion);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <PenSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Builder</h1>
      </div>
      <p className="text-muted-foreground">
        Provide your existing resume or key details, and let our AI craft a professional, optimized version for you.
      </p>

      {isPremiumFeature && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Premium Feature</AlertTitle>
          <AlertDescription>
            The AI Resume Builder is a premium feature. 
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/pricing" className="font-bold text-primary hover:underline">Upgrade your plan</Link></Button> to build a winning resume.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className={`space-y-4 ${isPremiumFeature ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Paste your current resume, or just a list of your skills, experience, and education.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your content here..."
                className="h-60 min-h-60"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Target Job Description (Optional)</CardTitle>
              <CardDescription>Pasting a job description will help the AI tailor your resume for that specific role.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                className="h-48 min-h-48"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>
          <Button onClick={handleBuild} disabled={isLoading || isPremiumFeature} size="lg" className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              isPremiumFeature ? <Lock className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />
            )}
            Build My Resume
          </Button>
        </div>
        
        <div className="space-y-4">
          <Card className="h-full min-h-[300px]">
            <CardHeader>
              <CardTitle>Generated Resume</CardTitle>
              <CardDescription>The AI-crafted version of your resume will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !isPremiumFeature && (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Building your new resume...</p>
                  </div>
                </div>
              )}

              {builtResume && !isPremiumFeature && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleCopy}
                  >
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <div className="p-4 border rounded-md bg-muted/50 max-h-[600px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-body">{builtResume.improvedVersion}</pre>
                  </div>
                </div>
              )}

              {(!isLoading && !builtResume || isPremiumFeature) && (
                 <div className="flex h-full min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    {isPremiumFeature ? (
                      <>
                        <Lock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">Upgrade to Premium to build your resume.</p>
                        <Button asChild className="mt-4">
                          <Link href="/pricing">Upgrade</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <PenSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">Your generated resume will appear here.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
