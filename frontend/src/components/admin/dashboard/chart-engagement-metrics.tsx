'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'User engagement metrics over time'

const chartData = [
  { date: '2024-06-01', comments: 145, shares: 89, likes: 267 },
  { date: '2024-06-02', comments: 167, shares: 102, likes: 289 },
  { date: '2024-06-03', comments: 134, shares: 78, likes: 234 },
  { date: '2024-06-04', comments: 189, shares: 134, likes: 356 },
  { date: '2024-06-05', comments: 156, shares: 98, likes: 278 },
  { date: '2024-06-06', comments: 203, shares: 156, likes: 398 },
  { date: '2024-06-07', comments: 178, shares: 123, likes: 334 },
  { date: '2024-06-08', comments: 145, shares: 87, likes: 256 },
  { date: '2024-06-09', comments: 234, shares: 178, likes: 445 },
  { date: '2024-06-10', comments: 198, shares: 145, likes: 367 },
  { date: '2024-06-11', comments: 167, shares: 109, likes: 298 },
  { date: '2024-06-12', comments: 256, shares: 198, likes: 478 },
  { date: '2024-06-13', comments: 189, shares: 134, likes: 345 },
  { date: '2024-06-14', comments: 212, shares: 167, likes: 389 },
  { date: '2024-06-15', comments: 178, shares: 123, likes: 312 },
  { date: '2024-06-16', comments: 234, shares: 189, likes: 434 },
  { date: '2024-06-17', comments: 267, shares: 212, likes: 498 },
  { date: '2024-06-18', comments: 189, shares: 145, likes: 356 },
  { date: '2024-06-19', comments: 203, shares: 167, likes: 378 },
  { date: '2024-06-20', comments: 245, shares: 189, likes: 456 },
  { date: '2024-06-21', comments: 178, shares: 134, likes: 334 },
  { date: '2024-06-22', comments: 198, shares: 156, likes: 367 },
  { date: '2024-06-23', comments: 267, shares: 212, likes: 489 },
  { date: '2024-06-24', comments: 189, shares: 145, likes: 345 },
  { date: '2024-06-25', comments: 156, shares: 109, likes: 289 },
  { date: '2024-06-26', comments: 234, shares: 178, likes: 423 },
  { date: '2024-06-27', comments: 278, shares: 234, likes: 512 },
  { date: '2024-06-28', comments: 203, shares: 167, likes: 378 },
  { date: '2024-06-29', comments: 189, shares: 145, likes: 345 },
  { date: '2024-06-30', comments: 245, shares: 198, likes: 456 }
]

const chartConfig = {
  comments: {
    label: 'Comments',
    color: 'hsl(var(--chart-1))'
  },
  shares: {
    label: 'Shares',
    color: 'hsl(var(--chart-2))'
  },
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig

export function ChartEngagementMetrics() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>Daily comments, shares, and likes for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }}
                />
              }
            />
            <Line
              dataKey='likes'
              type='monotone'
              stroke='var(--color-likes)'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='comments'
              type='monotone'
              stroke='var(--color-comments)'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='shares'
              type='monotone'
              stroke='var(--color-shares)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
