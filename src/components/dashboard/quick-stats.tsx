import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, CheckCircle, Target } from 'lucide-react';

const stats = [
  {
    title: 'Total Sessions',
    value: '0',
    icon: Activity,
    change: 'Complete an interview to start',
  },
  {
    title: 'Average Score',
    value: '0%',
    icon: Target,
    change: 'Your score will appear here',
  },
  {
    title: 'Success Rate',
    value: '0%',
    icon: CheckCircle,
    change: 'Based on your performance',
  },
  {
    title: 'Practice Streak',
    value: '0 days',
    icon: BarChart,
    change: 'Start practicing today!',
  },
];

export function QuickStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
