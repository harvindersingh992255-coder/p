import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
      </div>
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon you'll be able to manage your profile, career goals, and application settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
