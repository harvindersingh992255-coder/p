import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Tips & Resources</h1>
      </div>
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A curated library of articles, videos, and best practices to help you ace your interviews will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
