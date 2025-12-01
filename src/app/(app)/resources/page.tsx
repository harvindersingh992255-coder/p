import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mic, Star, Video } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    title: 'Master the STAR Method',
    description: 'Learn how to structure your answers to behavioral questions effectively.',
    icon: Star,
    href: '#',
    type: 'Article',
  },
  {
    title: 'Top 10 Frontend Technical Questions',
    description: 'A deep dive into common technical questions for frontend developers.',
    icon: BookOpen,
    href: '#',
    type: 'Guide',
  },
  {
    title: 'Body Language for Interviews',
    description: 'A video guide to non-verbal cues that project confidence.',
    icon: Video,
    href: '#',
    type: 'Video',
  },
  {
    title: 'Speaking with Clarity',
    description: 'Tips and exercises to improve your vocal delivery and conciseness.',
    icon: Mic,
    href: '#',
    type: 'Article',
  },
    {
    title: 'Case Study Interview Prep',
    description: 'A complete walkthrough of how to approach and solve case studies.',
    icon: BookOpen,
    href: '#',
    type: 'Guide',
  },
    {
    title: 'Salary Negotiation Tactics',
    description: 'Learn how to negotiate your salary with confidence.',
    icon: Video,
    href: '#',
    type: 'Video',
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Tips & Resources</h1>
      </div>
      <p className="text-muted-foreground">
        A curated library of articles, videos, and best practices to help you ace your interviews.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.type}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{resource.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
                <Link href={resource.href} className="text-sm font-semibold text-primary hover:underline">
                    Read More &rarr;
                </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
