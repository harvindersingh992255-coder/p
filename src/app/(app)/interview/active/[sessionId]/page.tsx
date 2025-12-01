import { ActiveInterview } from '@/components/interview/active-interview';
import { Suspense } from 'react';

function InterviewPageContent() {
  return <ActiveInterview />;
}

export default function InterviewPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.28))]">
      <Suspense fallback={<div>Loading interview settings...</div>}>
        <InterviewPageContent />
      </Suspense>
    </div>
  );
}
