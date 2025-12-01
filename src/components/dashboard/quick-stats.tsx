import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, CheckCircle, Target } from 'lucide-react';

const stats = [
  {
    title: 'Total Sessions',
    value: '12',
    icon: Activity,
    change: '+2 this week',
  },
  {
    title: 'Average Score',
    value: '82%',
    icon: Target,
    change: '+5% improvement',
  },
  {
    title: 'Success Rate',
    value: '75%',
    icon: CheckCircle,
    change: 'vs. 70% last week',
  },
  {
    title: 'Practice Streak',
    value: '5 days',
    icon: BarChart,
    change: 'Keep it going!',
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
