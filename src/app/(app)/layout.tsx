import { AppLayout } from '@/components/layout/app-layout';
import { PlanProvider } from '@/hooks/use-plan';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlanProvider>
      <AppLayout>{children}</AppLayout>
    </PlanProvider>
  );
}
