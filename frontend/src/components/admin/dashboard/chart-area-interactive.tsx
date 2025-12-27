'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'

export const description = 'Article views analytics chart'

const chartData = [
  { date: '2024-04-01', views: 2850, uniqueVisitors: 1920 },
  { date: '2024-04-02', views: 3420, uniqueVisitors: 2180 },
  { date: '2024-04-03', views: 2970, uniqueVisitors: 1890 },
  { date: '2024-04-04', views: 4120, uniqueVisitors: 2650 },
  { date: '2024-04-05', views: 3850, uniqueVisitors: 2420 },
  { date: '2024-04-06', views: 4560, uniqueVisitors: 2890 },
  { date: '2024-04-07', views: 3240, uniqueVisitors: 2010 },
  { date: '2024-04-08', views: 5120, uniqueVisitors: 3280 },
  { date: '2024-04-09', views: 2890, uniqueVisitors: 1840 },
  { date: '2024-04-10', views: 3670, uniqueVisitors: 2340 },
  { date: '2024-04-11', views: 4890, uniqueVisitors: 3120 },
  { date: '2024-04-12', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-04-13', views: 5240, uniqueVisitors: 3350 },
  { date: '2024-04-14', views: 3120, uniqueVisitors: 1990 },
  { date: '2024-04-15', views: 2840, uniqueVisitors: 1810 },
  { date: '2024-04-16', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-04-17', views: 6120, uniqueVisitors: 3900 },
  { date: '2024-04-18', views: 5680, uniqueVisitors: 3620 },
  { date: '2024-04-19', views: 3890, uniqueVisitors: 2480 },
  { date: '2024-04-20', views: 2950, uniqueVisitors: 1880 },
  { date: '2024-04-21', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-04-22', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-04-23', views: 4120, uniqueVisitors: 2630 },
  { date: '2024-04-24', views: 5340, uniqueVisitors: 3410 },
  { date: '2024-04-25', views: 4670, uniqueVisitors: 2980 },
  { date: '2024-04-26', views: 2890, uniqueVisitors: 1840 },
  { date: '2024-04-27', views: 6240, uniqueVisitors: 3980 },
  { date: '2024-04-28', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-04-29', views: 4780, uniqueVisitors: 3050 },
  { date: '2024-04-30', views: 6120, uniqueVisitors: 3900 },
  { date: '2024-05-01', views: 3780, uniqueVisitors: 2410 },
  { date: '2024-05-02', views: 4890, uniqueVisitors: 3120 },
  { date: '2024-05-03', views: 3650, uniqueVisitors: 2330 },
  { date: '2024-05-04', views: 5670, uniqueVisitors: 3620 },
  { date: '2024-05-05', views: 6450, uniqueVisitors: 4120 },
  { date: '2024-05-06', views: 7120, uniqueVisitors: 4540 },
  { date: '2024-05-07', views: 5240, uniqueVisitors: 3340 },
  { date: '2024-05-08', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-05-09', views: 3890, uniqueVisitors: 2480 },
  { date: '2024-05-10', views: 4780, uniqueVisitors: 3050 },
  { date: '2024-05-11', views: 4340, uniqueVisitors: 2770 },
  { date: '2024-05-12', views: 3780, uniqueVisitors: 2410 },
  { date: '2024-05-13', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-05-14', views: 6890, uniqueVisitors: 4390 },
  { date: '2024-05-15', views: 6120, uniqueVisitors: 3900 },
  { date: '2024-05-16', views: 5340, uniqueVisitors: 3410 },
  { date: '2024-05-17', views: 6780, uniqueVisitors: 4320 },
  { date: '2024-05-18', views: 4890, uniqueVisitors: 3120 },
  { date: '2024-05-19', views: 3780, uniqueVisitors: 2410 },
  { date: '2024-05-20', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-05-21', views: 2890, uniqueVisitors: 1840 },
  { date: '2024-05-22', views: 2670, uniqueVisitors: 1700 },
  { date: '2024-05-23', views: 4120, uniqueVisitors: 2630 },
  { date: '2024-05-24', views: 3890, uniqueVisitors: 2480 },
  { date: '2024-05-25', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-05-26', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-05-27', views: 6340, uniqueVisitors: 4040 },
  { date: '2024-05-28', views: 3780, uniqueVisitors: 2410 },
  { date: '2024-05-29', views: 2890, uniqueVisitors: 1840 },
  { date: '2024-05-30', views: 4560, uniqueVisitors: 2910 },
  { date: '2024-05-31', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-06-01', views: 3670, uniqueVisitors: 2340 },
  { date: '2024-06-02', views: 6120, uniqueVisitors: 3900 },
  { date: '2024-06-03', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-06-04', views: 5890, uniqueVisitors: 3760 },
  { date: '2024-06-05', views: 2780, uniqueVisitors: 1770 },
  { date: '2024-06-06', views: 4340, uniqueVisitors: 2770 },
  { date: '2024-06-07', views: 4890, uniqueVisitors: 3120 },
  { date: '2024-06-08', views: 5120, uniqueVisitors: 3270 },
  { date: '2024-06-09', views: 6340, uniqueVisitors: 4040 },
  { date: '2024-06-10', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-06-11', views: 2890, uniqueVisitors: 1840 },
  { date: '2024-06-12', views: 6780, uniqueVisitors: 4320 },
  { date: '2024-06-13', views: 2670, uniqueVisitors: 1700 },
  { date: '2024-06-14', views: 5890, uniqueVisitors: 3760 },
  { date: '2024-06-15', views: 4560, uniqueVisitors: 2910 },
  { date: '2024-06-16', views: 4890, uniqueVisitors: 3120 },
  { date: '2024-06-17', views: 6890, uniqueVisitors: 4390 },
  { date: '2024-06-18', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-06-19', views: 4340, uniqueVisitors: 2770 },
  { date: '2024-06-20', views: 5670, uniqueVisitors: 3620 },
  { date: '2024-06-21', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-06-22', views: 4120, uniqueVisitors: 2630 },
  { date: '2024-06-23', views: 6560, uniqueVisitors: 4180 },
  { date: '2024-06-24', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-06-25', views: 3450, uniqueVisitors: 2200 },
  { date: '2024-06-26', views: 5780, uniqueVisitors: 3690 },
  { date: '2024-06-27', views: 6120, uniqueVisitors: 3900 },
  { date: '2024-06-28', views: 3560, uniqueVisitors: 2270 },
  { date: '2024-06-29', views: 3240, uniqueVisitors: 2070 },
  { date: '2024-06-30', views: 6340, uniqueVisitors: 4040 }
]

const chartConfig = {
  analytics: {
    label: 'Analytics'
  },
  views: {
    label: 'Total Views',
    color: 'hsl(var(--chart-1))'
  },
  uniqueVisitors: {
    label: 'Unique Visitors',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('90d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Article Views Analytics</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Total views and unique visitors for the last 3 months
          </span>
          <span className='@[540px]/card:hidden'>Last 3 months analytics</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden @[767px]/card:flex *:data-[slot=toggle-group-item]:!px-4'
          >
            <ToggleGroupItem value='90d'>Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='@[767px]/card:hidden **:data-[slot=select-value]:block flex w-40 **:data-[slot=select-value]:truncate'
              size='sm'
              aria-label='Select a value'
            >
              <SelectValue placeholder='Last 3 months' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                Last 3 months
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 sm:px-6 pt-4 sm:pt-6'>
        <ChartContainer config={chartConfig} className='w-full h-[250px] aspect-auto'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillViews' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-views)' stopOpacity={1.0} />
                <stop offset='95%' stopColor='var(--color-views)' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillUniqueVisitors' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-uniqueVisitors)' stopOpacity={0.8} />
                <stop offset='95%' stopColor='var(--color-uniqueVisitors)' stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='uniqueVisitors'
              type='natural'
              fill='url(#fillUniqueVisitors)'
              stroke='var(--color-uniqueVisitors)'
              stackId='a'
            />
            <Area
              dataKey='views'
              type='natural'
              fill='url(#fillViews)'
              stroke='var(--color-views)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
