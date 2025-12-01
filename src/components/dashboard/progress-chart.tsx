'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { date: 'Jul 1', score: 65 },
  { date: 'Jul 4', score: 72 },
  { date: 'Jul 8', score: 70 },
  { date: 'Jul 12', score: 81 },
  { date: 'Jul 15', score: 92 },
  { date: 'Jul 18', score: 76 },
  { date: 'Jul 20', score: 88 },
];

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
};

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Your average score trend from recent sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
                domain={[50, 100]}
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
