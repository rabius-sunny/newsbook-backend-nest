import SidebarNews from '../layout/sidebar-news'

type TProps = {
  data: { latest: any; popular: any }
}
export default async function FeatureLeftSidebar({ data }: TProps) {
  return (
    <div className='space-y-6 lg:col-span-1'>
      {/* Ad placeholder */}
      <div className='flex justify-center items-center bg-gray-200 h-64 text-gray-500'>
        বিজ্ঞাপন
      </div>

      <SidebarNews news={data?.latest} />

      {/* Popular News */}
      {/* <div className='bg-white p-4 border _rounded-lg'>
        <h3 className='mb-4 pb-2 border-b font-bold text-gray-900'>জনপ্রিয়</h3>
        <div className='space-y-3'>
          {data?.popular.map((news: News, idx: number) => (
            <div key={idx} className='group flex items-start gap-3 cursor-pointer'>
              <span className='flex flex-shrink-0 justify-center items-center bg-primary mt-1 rounded-full w-6 h-6 font-extrabold text-white text-xs'>
                {idx + 1}
              </span>
              <CustomLink
                href={`/news/${news?.slug}`}
                className='text-gray-900 group-hover:text-primary text-sm line-clamp-2 transition-colors'
              >
                {news?.title}
              </CustomLink>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}
