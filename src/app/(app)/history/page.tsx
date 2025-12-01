'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockHistory = [
  {
    id: 'sess_1',
    date: '2024-07-20',
    jobRole: 'Frontend Developer',
    overallScore: 88,
  },
  {
    id: 'sess_2',
    date: '2024-07-18',
    jobRole: 'Product Manager',
    overallScore: 76,
  },
  {
    id: 'sess_3',
    date: '2024-07-15',
    jobRole: 'UI/UX Designer',
    overallScore: 92,
  },
  {
    id: 'sess_4',
    date: '2024-07-12',
    jobRole: 'Data Analyst',
    overallScore: 81,
  },
   {
    id: 'sess_5',
    date: '2024-07-10',
    jobRole: 'Backend Developer',
    overallScore: 79,
  },
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = mockHistory.filter((session) =>
    session.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
            <p className="text-muted-foreground">Review your past performance and track your improvement.</p>
          </div>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job role..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Job Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.jobRole}</TableCell>
                    <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <Badge variant={session.overallScore > 80 ? 'default' : 'secondary'} className={session.overallScore > 80 ? 'bg-accent text-accent-foreground' : ''}>
                        {session.overallScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/interview/results/${session.id}`}>View Results</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
