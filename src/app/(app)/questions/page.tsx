import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <FileQuestion className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
      </div>
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            An extensive database of interview questions with filtering and practice modes is on its way.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
