import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <History className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
      </div>
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A detailed log of all your past interview sessions with search and filter options will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
