'use client';

import { useState, useRef } from 'react';
import { analyzeResume, AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Wand2, UploadCloud, FileCheck2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setFileName(file.name);
          toast({
            title: 'File Uploaded',
            description: `${file.name} has been successfully read.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: 'Unsupported File Type',
          description: 'Please upload a .pdf or .txt file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAnalyze = async () => {
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
      // In a real app, you'd parse PDF/DOCX server-side for better results.
      // Here we assume plain text extraction is sufficient.
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
        Paste your resume, upload a file, and add an optional job description to get AI-powered feedback.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
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
                    "Click to upload a .pdf or .txt file"
                  )}
                </p>
                <Input 
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt"
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
