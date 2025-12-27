'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'Top performing articles by views'

const chartData = [
  { title: 'Breaking: Major Policy Changes Announced', views: 15420, shares: 1240 },
  { title: 'Sports Championship Finals Results', views: 12850, shares: 980 },
  { title: 'Tech Innovation Summit Highlights', views: 11340, shares: 890 },
  { title: 'Economic Growth Report Released', views: 9870, shares: 750 },
  { title: 'Healthcare Breakthrough Discovery', views: 8960, shares: 670 },
  { title: 'Education Reform Initiatives', views: 7850, shares: 520 },
  { title: 'Environmental Conservation Update', views: 6940, shares: 480 },
  { title: 'Cultural Festival Coverage', views: 5890, shares: 390 }
]

const chartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--chart-1))'
  },
  shares: {
    label: 'Shares',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function ChartTopArticles() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Top Performing Articles</CardTitle>
        <CardDescription>Most viewed articles in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout='horizontal'
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='title'
              type='category'
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              hide
            />
            <XAxis type='number' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
            <Bar dataKey='views' fill='var(--color-views)' radius={4} />
          </BarChart>
        </ChartContainer>

        {/* Article titles list */}
        <div className='space-y-2 mt-4'>
          {chartData.slice(0, 5).map((article, index) => (
            <div
              key={index}
              className='flex justify-between items-center bg-muted/30 p-2 rounded-lg'
            >
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>{article.title}</p>
                <p className='text-muted-foreground text-xs'>
                  {article.views.toLocaleString()} views • {article.shares} shares
                </p>
              </div>
              <div className='font-medium text-sm'>#{index + 1}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
