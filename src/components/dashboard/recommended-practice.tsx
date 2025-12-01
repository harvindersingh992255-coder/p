import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, Mic } from 'lucide-react';

const recommendations = [
  {
    title: 'Behavioral Questions',
    description: 'Focus on STAR method.',
    icon: Lightbulb,
  },
  {
    title: 'Technical Deep Dive',
    description: 'Practice data structures.',
    icon: Zap,
  },
  {
    title: 'Clarity & Conciseness',
    description: 'Improve your speaking pace.',
    icon: Mic,
  },
];

export function RecommendedPractice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Practice Areas</CardTitle>
        <CardDescription>Based on your recent performance, here's what to work on.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
            <div className="bg-primary/10 p-2 rounded-full">
                <rec.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{rec.title}</p>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
            <Button variant="ghost" size="sm">
              Practice
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
