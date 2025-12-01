'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData: {date: string, score: number | null}[] = [
  { date: 'Start', score: null },
];

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
};

export function ProgressChart() {
  const hasData = chartData.some(d => d.score !== null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Your average score trend from recent sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          {!hasData ? (
             <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">Complete an interview to see your progress.</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelKey="score" />}
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke="var(--color-score)"
                strokeWidth={2}
                dot={{
                  fill: 'var(--color-score)',
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
