import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { InterviewSession } from '@/lib/types';

const recentSessions: Omit<InterviewSession, 'questions'>[] = [
  {
    id: '1',
    date: '2024-07-20',
    jobRole: 'Frontend Developer',
    industry: 'Tech',
    overallScore: 88,
  },
  {
    id: '2',
    date: '2024-07-18',
    jobRole: 'Product Manager',
    industry: 'SaaS',
    overallScore: 76,
  },
  {
    id: '3',
    date: '2024-07-15',
    jobRole: 'UI/UX Designer',
    industry: 'E-commerce',
    overallScore: 92,
  },
  {
    id: '4',
    date: '2024-07-12',
    jobRole: 'Data Analyst',
    industry: 'Finance',
    overallScore: 81,
  },
];

export function RecentSessions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Interview Sessions</CardTitle>
        <CardDescription>Review your past performances and track your improvement.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Role</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="font-medium">{session.jobRole}</div>
                  <div className="text-sm text-muted-foreground">{session.industry}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(session.date).toLocaleDateString()}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={session.overallScore > 80 ? 'default' : 'secondary'} className={session.overallScore > 80 ? 'bg-accent text-accent-foreground' : ''}>
                    {session.overallScore}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
