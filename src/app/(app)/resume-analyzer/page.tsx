'use client';

import { useState } from 'react';
import { analyzeResume, AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Wand2, ArrowRight } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste your resume text before analyzing.',
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
        Paste your resume and an optional job description to get AI-powered feedback and improvements.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here..."
                className="h-64 min-h-64"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
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
          <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze & Improve
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading && (
            <Card className="flex h-full min-h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis & Improved Version</CardTitle>
                <CardDescription>Overall Score: {analysis.overallScore}/100</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold mb-2">Feedback</h3>
                    <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                 </div>
                 <div>
                    <h3 className="font-semibold mb-2">Suggestions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {analysis.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-semibold mb-2">Improved Resume</h3>
                    <div className="p-4 border rounded-md bg-muted/50 max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-body">{analysis.improvedVersion}</pre>
                    </div>
                 </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && !analysis && (
             <Card className="flex h-full min-h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Your analysis will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
