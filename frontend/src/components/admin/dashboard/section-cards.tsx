import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export function SectionCards() {
  return (
    <div className='gap-4 grid grid-cols-1 @5xl/main:grid-cols-4 @xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Articles</CardDescription>
          <CardTitle className='font-semibold tabular-nums text-2xl @[250px]/card:text-3xl'>
            1,847
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUp />
              +23
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex gap-2 font-medium line-clamp-1'>
            23 new articles this week <TrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Content production is strong</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Monthly Page Views</CardDescription>
          <CardTitle className='font-semibold tabular-nums text-2xl @[250px]/card:text-3xl'>
            524K
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUp />
              +12.8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex gap-2 font-medium line-clamp-1'>
            Growing readership base <TrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Traffic increased this month</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Subscribers</CardDescription>
          <CardTitle className='font-semibold tabular-nums text-2xl @[250px]/card:text-3xl'>
            12,456
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUp />
              +8.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex gap-2 font-medium line-clamp-1'>
            Strong subscriber growth <TrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Newsletter engagement up</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Avg. Reading Time</CardDescription>
          <CardTitle className='font-semibold tabular-nums text-2xl @[250px]/card:text-3xl'>
            3.2m
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUp />
              +0.4m
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex gap-2 font-medium line-clamp-1'>
            Improved content quality <TrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Readers staying longer</div>
        </CardFooter>
      </Card>
    </div>
  )
}
