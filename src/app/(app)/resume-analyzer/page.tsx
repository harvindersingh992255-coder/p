'use client';

import { useState, useRef } from 'react';
import { analyzeResume, AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Wand2, UploadCloud, FileCheck2, Lock, ListChecks, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

// MOCK: In a real app, this would come from user authentication
const userPlan = 'Free'; // 'Free', 'Premium', or 'Super'

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isPremiumFeature = userPlan === 'Free';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPremiumFeature) return;
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
             toast({
                title: 'File not supported yet',
                description: `DOCX file parsing is coming soon. Please use PDF or TXT.`,
                variant: 'destructive',
             });
             return;
          }
          const text = new TextDecoder().decode(arrayBuffer);
          setResumeText(text);
          setFileName(file.name);
          toast({
            title: 'File Uploaded',
            description: `${file.name} has been successfully read.`,
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast({
          title: 'Unsupported File Type',
          description: 'Please upload a .pdf, .docx, or .txt file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (isPremiumFeature) return;
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste or upload your resume before analyzing.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume({ resumeText, jobDescription });
      setAnalysis(result);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Analyzer</h1>
      </div>
      <p className="text-muted-foreground">
        Get AI-powered feedback on your resume. For building a new one, head to the <Link href="/resume-builder" className="text-primary underline">Resume Builder</Link>.
      </p>

      {isPremiumFeature && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Premium Feature</AlertTitle>
          <AlertDescription>
            The AI Resume Analyzer is a premium feature. 
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/pricing" className="font-bold text-primary hover:underline">Upgrade your plan</Link></Button> to get access.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className={`space-y-4 ${isPremiumFeature ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
              <CardDescription>You can either paste your resume or upload a file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {fileName ? (
                    <span className="flex items-center justify-center gap-2 font-semibold text-primary"><FileCheck2 className="h-4 w-4"/> {fileName}</span>
                  ) : (
                    "Click to upload a .pdf, .docx, or .txt file"
                  )}
                </p>
                <Input 
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-grow border-t border-muted-foreground/30"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-muted-foreground/30"></div>
              </div>
              <Textarea
                placeholder="Paste your resume content here..."
                className="h-60 min-h-60"
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setFileName('');
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Target Job Description (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here for tailored feedback..."
                className="h-48 min-h-48"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>
          <Button onClick={handleAnalyze} disabled={isLoading || isPremiumFeature} size="lg" className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              isPremiumFeature ? <Lock className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze Resume
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading && !isPremiumFeature && (
            <Card className="flex h-full min-h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
              </CardContent>
            </Card>
          )}

          {analysis && !isPremiumFeature && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Report</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Overall Score: {analysis.overallScore}/100</span>
                    <Progress value={analysis.overallScore} className="w-1/2" />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <ThumbsUp className="text-green-500 h-5 w-5 mt-1 shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Strengths</h4>
                        <p className="text-sm text-muted-foreground">{analysis.strengths}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <ThumbsDown className="text-red-500 h-5 w-5 mt-1 shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Areas for Improvement</h4>
                        <p className="text-sm text-muted-foreground">{analysis.weaknesses}</p>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><ListChecks /> Actionable Suggestions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        {analysis.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Want the AI to rewrite it for you? Check out the <Link href="/resume-builder" className="text-primary underline">Resume Builder</Link>.
                    </p>
                 </div>
              </CardContent>
            </Card>
          )}

          {(!isLoading && !analysis || isPremiumFeature) && (
             <Card className="flex h-full min-h-[300px] items-center justify-center">
              <CardContent className="text-center">
                 {isPremiumFeature ? (
                  <>
                    <Lock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Upgrade to Premium to see your analysis.</p>
                    <Button asChild className="mt-4">
                      <Link href="/pricing">Upgrade</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Your analysis will appear here.</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
