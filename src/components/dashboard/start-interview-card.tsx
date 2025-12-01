import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function StartInterviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Start a New Mock Interview</CardTitle>
        <CardDescription>
          Practice makes perfect. Let's build your confidence for the next big opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/interview/setup" passHref>
          <Button size="lg" className="w-full sm:w-auto">
            <span>Start New Session</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
