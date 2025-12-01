'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2, Sparkles, Zap, Lock } from 'lucide-react';
import { generatePepTalk } from '@/ai/flows/confidence-coach';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { usePlan } from '@/hooks/use-plan';

const topics = [
  { id: 'nerves', title: 'Pre-Interview Nerves', icon: Heart },
  { id: 'self-doubt', title: 'Imposter Syndrome', icon: Zap },
  { id: 'motivation', title: 'Lack of Motivation', icon: Sparkles },
];

export function ConfidenceCoach() {
  const { isPlanSufficient } = usePlan();
  const [pepTalk, setPepTalk] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { toast } = useToast();
  
  const hasAccess = isPlanSufficient('Premium');

  const handleGeneratePepTalk = async (topic: string) => {
    if (!hasAccess) return;
    setIsLoading(true);
    setPepTalk('');
    setSelectedTopic(topic);

    try {
      const result = await generatePepTalk({ topic });
      setPepTalk(result.pepTalk);
    } catch (error) {
      console.error('Failed to generate pep talk:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a pep talk. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Confidence Coach</h1>
          <p className="text-muted-foreground">
            Your personal AI-powered coach to help you build confidence and overcome interview anxiety.
          </p>
        </div>
      </div>
      
       {!hasAccess && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Premium Feature</AlertTitle>
          <AlertDescription>
            The AI Confidence Coach is a premium feature. 
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/pricing" className="font-bold text-primary hover:underline">Upgrade your plan</Link></Button> to unlock your inner confidence.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`${!hasAccess ? 'opacity-50 pointer-events-none' : ''}`}>
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
          <CardDescription>Select a topic to get a personalized pep talk from your AI coach.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant="outline"
                size="lg"
                className="h-24 flex flex-col gap-2"
                onClick={() => handleGeneratePepTalk(topic.id)}
                disabled={isLoading}
              >
                <topic.icon className="h-6 w-6 text-primary" />
                <span>{topic.title}</span>
              </Button>
            ))}
          </div>

          {(isLoading || pepTalk) && (
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                {isLoading && (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Your coach is thinking...</span>
                  </div>
                )}
                {pepTalk && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                        {pepTalk}
                    </blockquote>
                )}
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
