import { QuickStats } from '@/components/dashboard/quick-stats';
import { StartInterviewCard } from '@/components/dashboard/start-interview-card';
import { RecentSessions } from '@/components/dashboard/recent-sessions';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { RecommendedPractice } from '@/components/dashboard/recommended-practice';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Here's a summary of your interview practice progress.</p>
      </div>

      <QuickStats />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <StartInterviewCard />
          <RecentSessions />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProgressChart />
          <RecommendedPractice />
        </div>
      </div>
    </div>
  );
}
