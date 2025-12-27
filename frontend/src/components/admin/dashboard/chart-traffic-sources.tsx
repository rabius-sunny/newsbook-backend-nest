'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'Traffic sources breakdown'

const chartData = [
  { source: 'Direct', visitors: 18420, percentage: 35.2 },
  { source: 'Google Search', visitors: 15890, percentage: 30.4 },
  { source: 'Social Media', visitors: 8940, percentage: 17.1 },
  { source: 'Referral Sites', visitors: 5670, percentage: 10.8 },
  { source: 'Email Campaign', visitors: 2340, percentage: 4.5 },
  { source: 'Others', visitors: 1050, percentage: 2.0 }
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-1))'
  },
  percentage: {
    label: 'Percentage',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function ChartTrafficSources() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>
          Where your {totalVisitors.toLocaleString()} visitors come from
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
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
              dataKey='source'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='visitors' fill='var(--color-visitors)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Traffic sources breakdown */}
        <div className='space-y-3 mt-4'>
          {chartData.map((item, index) => (
            <div key={index} className='flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                <div
                  className='rounded-full w-3 h-3'
                  style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                />
                <span className='font-medium text-sm'>{item.source}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-muted-foreground'>{item.visitors.toLocaleString()}</span>
                <span className='font-medium'>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
