'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const allQuestions = [
  { id: 1, category: 'Behavioral', text: 'Tell me about a time you had to handle a conflict with a coworker.', difficulty: 'Medium' },
  { id: 2, category: 'Technical', text: 'Explain the difference between SQL and NoSQL databases.', difficulty: 'Hard' },
  { id: 3, category: 'Situational', text: 'How would you handle a situation where you are asked to meet an unrealistic deadline?', difficulty: 'Medium' },
  { id: 4, category: 'Behavioral', text: 'Describe a project you are most proud of and your role in it.', difficulty: 'Easy' },
  { id: 5, category: 'Technical', text: 'What is the event loop in JavaScript?', difficulty: 'Hard' },
  { id: 6, category: 'Situational', text: 'Imagine a key feature you developed has a major bug after deployment. What are your immediate next steps?', difficulty: 'Hard' },
  { id: 7, category: 'Behavioral', text: 'How do you keep your skills up-to-date?', difficulty: 'Easy' },
  { id: 8, category: 'Technical', text: 'What are the principles of object-oriented programming?', difficulty: 'Medium' },
];

export default function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const filteredQuestions = allQuestions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'All' || q.category === category) &&
    (difficulty === 'All' || q.difficulty === difficulty)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <FileQuestion className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">Browse and practice from a curated list of interview questions.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search questions..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Behavioral">Behavioral</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Situational">Situational</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
              <AccordionItem value={`item-${q.id}`} key={q.id}>
                <AccordionTrigger>{q.text}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                     <p className="text-muted-foreground">
                       This is a sample hint or key points to consider when answering. For a real question, this would contain guidance on how to structure your response, what to highlight, and what pitfalls to avoid.
                     </p>
                    <div className="flex items-center gap-4">
                        <Button>Practice this Question</Button>
                        <Button variant="outline">Reveal Key Points</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )) : (
                <div className="text-center py-12 text-muted-foreground">
                    No questions found matching your criteria.
                </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
