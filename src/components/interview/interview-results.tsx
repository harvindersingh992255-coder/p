'use client';

import { useState, useEffect } from 'react';
import { analyzeInterviewResponse } from '@/ai/flows/ai-performance-feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { BarChart, MessageCircle, Play, Smile, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"


const mockFeedback = {
  overallScore: 82,
  breakdown: [
    { category: 'Clarity', score: 85 },
    { category: 'Relevance', score: 90 },
    { category: 'Confidence', score: 75 },
    { category: 'STAR Method', score: 78 },
  ],
  questions: [
    {
      question: "Tell me about a time you faced a challenge at work.",
      feedback: {
        score: 80,
        strengths: "Good use of a specific example. You clearly outlined the situation.",
        weaknesses: "The 'Result' part of your STAR answer could have been more quantifiable.",
        improvementSuggestions: "Try to include metrics or specific outcomes to show impact. For example, '...which led to a 15% increase in efficiency.'",
        bodyLanguageFeedback: "You maintained good eye contact but fidgeted slightly when discussing the challenge."
      }
    },
    {
      question: "What are your biggest strengths and weaknesses?",
      feedback: {
        score: 85,
        strengths: "You provided a confident and well-reasoned answer for your strengths, linking them to the job role.",
        weaknesses: "Your weakness was a bit generic. 'Perfectionism' can be seen as a cliché.",
        improvementSuggestions: "Choose a real weakness and show how you are actively working to improve it. This demonstrates self-awareness."
      }
    }
  ]
};

export function InterviewResults() {
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFeedback = async () => {
      setIsLoading(true);
      // In a real app, you would fetch real data and call the AI flow
      // const response = await analyzeInterviewResponse({ ... });
      setTimeout(() => {
        setFeedback(mockFeedback);
        setIsLoading(false);
      }, 2000);
    };
    getFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Analyzing your performance...</p>
      </div>
    );
  }

  if (!feedback) return <p>Could not load feedback.</p>;
  
  const chartConfig = {
    score: { label: "Score", color: "hsl(var(--primary))" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Your Interview Results</CardTitle>
          <CardDescription>An AI-powered analysis of your performance.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-6 border rounded-lg">
             <div className="relative size-40">
                <svg className="size-full" viewBox="0 0 36 36">
                    <path className="stroke-current text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2"></path>
                    <path className="stroke-current text-primary" strokeDasharray={`${feedback.overallScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{feedback.overallScore}</span>
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                </div>
             </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Performance Breakdown</h3>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer>
                <RechartsBarChart layout="vertical" data={feedback.breakdown} margin={{left:10}}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="score" layout="vertical" radius={5} fill="var(--color-score)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Question-by-Question Feedback</CardTitle>
          <CardDescription>Detailed analysis for each of your answers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {feedback.questions.map((item: any, index: number) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>Question {index + 1}</span>
                    <Badge variant={item.feedback.score > 80 ? "default" : "secondary"} className={item.feedback.score > 80 ? 'bg-accent text-accent-foreground' : ''}>
                        Score: {item.feedback.score}%
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="italic text-muted-foreground">"{item.question}"</p>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex gap-4">
                        <ThumbsUp className="text-green-500 h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-semibold">Strengths</h4>
                            <p className="text-sm">{item.feedback.strengths}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <ThumbsDown className="text-red-500 h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-semibold">Areas for Improvement</h4>
                            <p className="text-sm">{item.feedback.weaknesses}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <MessageCircle className="text-primary h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-semibold">AI Suggestion</h4>
                            <p className="text-sm">{item.feedback.improvementSuggestions}</p>
                        </div>
                    </div>
                    {item.feedback.bodyLanguageFeedback && <div className="flex gap-4">
                        <Smile className="text-yellow-500 h-5 w-5 mt-1"/>
                        <div>
                            <h4 className="font-semibold">Body Language</h4>
                            <p className="text-sm">{item.feedback.bodyLanguageFeedback}</p>
                        </div>
                    </div>}
                  </div>
                  <Button variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Playback Your Answer
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
