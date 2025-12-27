'use client'

import * as React from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'Article distribution by categories'

const chartData = [
  { category: 'Politics', articles: 245, fill: 'hsl(var(--chart-1))' },
  { category: 'Sports', articles: 186, fill: 'hsl(var(--chart-2))' },
  { category: 'Technology', articles: 173, fill: 'hsl(var(--chart-3))' },
  { category: 'Business', articles: 142, fill: 'hsl(var(--chart-4))' },
  { category: 'Entertainment', articles: 128, fill: 'hsl(var(--chart-5))' },
  { category: 'Health', articles: 97, fill: 'hsl(var(--chart-6))' },
  { category: 'Education', articles: 74, fill: 'hsl(var(--chart-7))' },
  { category: 'Others', articles: 89, fill: 'hsl(var(--muted))' }
]

const chartConfig = {
  articles: {
    label: 'Articles'
  },
  politics: {
    label: 'Politics',
    color: 'hsl(var(--chart-1))'
  },
  sports: {
    label: 'Sports',
    color: 'hsl(var(--chart-2))'
  },
  technology: {
    label: 'Technology',
    color: 'hsl(var(--chart-3))'
  },
  business: {
    label: 'Business',
    color: 'hsl(var(--chart-4))'
  },
  entertainment: {
    label: 'Entertainment',
    color: 'hsl(var(--chart-5))'
  },
  health: {
    label: 'Health',
    color: 'hsl(var(--chart-6))'
  },
  education: {
    label: 'Education',
    color: 'hsl(var(--chart-7))'
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--muted))'
  }
} satisfies ChartConfig

export function ChartCategoriesPie() {
  const totalArticles = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.articles, 0)
  }, [])

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Articles by Category</CardTitle>
        <CardDescription>
          Distribution of {totalArticles} articles across categories
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto max-h-[300px] aspect-square'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey='articles'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className='gap-2 grid grid-cols-2 mt-4 text-sm'>
          {chartData.map((item) => (
            <div key={item.category} className='flex items-center gap-2'>
              <div className='rounded-sm w-3 h-3' style={{ backgroundColor: item.fill }} />
              <span className='text-muted-foreground'>{item.category}</span>
              <span className='ml-auto font-medium'>{item.articles}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
