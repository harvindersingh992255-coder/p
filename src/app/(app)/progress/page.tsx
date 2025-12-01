import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
      </div>
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will feature detailed charts and analytics to track your interview skill development over time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
