import { NewsGrid } from '../news-section/NewsGrid'

type TProps = {
  data: News[]
}
export default async function FeatureRightSidebar({ data }: TProps) {
  return (
    <div className='lg:col-span-1'>
      <NewsGrid items={data} variant='compact-list' itemLayout='compactSlim' spacing='loose' />
    </div>
  )
}
