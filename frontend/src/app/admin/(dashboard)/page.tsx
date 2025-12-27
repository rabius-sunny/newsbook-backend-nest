import {
  ChartAreaInteractive,
  ChartCategoriesPie,
  ChartEngagementMetrics,
  ChartTopArticles,
  ChartTrafficSources,
  SectionCards
} from '@/components/admin/dashboard'

export default function Page() {
  return (
    <div className='flex flex-col flex-1'>
      <div className='@container/main flex flex-col flex-1 gap-2'>
        <div className='flex flex-col gap-4 md:gap-6'>
          {/* Key Metrics Cards */}
          <SectionCards />

          {/* Main Analytics Chart */}
          <div className=''>
            <ChartAreaInteractive />
          </div>

          {/* Secondary Charts Grid */}
          <div className='gap-4 md:gap-6 grid grid-cols-1 xl:grid-cols-2'>
            <ChartEngagementMetrics />
            <ChartCategoriesPie />
          </div>

          {/* Bottom Charts Grid */}
          <div className='gap-4 md:gap-6 grid grid-cols-1 xl:grid-cols-2'>
            <ChartTopArticles />
            <ChartTrafficSources />
          </div>
        </div>
      </div>
    </div>
  )
}
